<script setup lang="ts">
import { ref } from "vue";
import ImportPanel from "../components/common/ImportPanel.vue";
import SectionCard from "../components/common/SectionCard.vue";
import EmptyState from "../components/common/EmptyState.vue";
import { mockData } from "../mocks/seedData";
import type { ParsedSection } from "../hooks/usePolicyParser";

const documents = mockData.policyDocument;
const sections = ref<ParsedSection[]>([]);

function onImported(payload: { sections: ParsedSection[] }) {
  sections.value = payload.sections;
}
</script>

<template>
  <section class="documents-page panel">
    <h2>粘贴并导入政策文本</h2>
    <ImportPanel @imported="onImported" />
    <div v-if="sections.length" class="parsed">
      <h3>本次解析结果（{{ sections.length }} 段）</h3>
      <div class="grid">
        <SectionCard
          v-for="(section, index) in sections"
          :key="index"
          :section-no="`第 ${index + 1} 段`"
          :heading="section.heading"
          :content="section.content"
        />
      </div>
    </div>
    <h3 class="history-title">历史版本</h3>
    <div v-if="documents.length" class="doc-list">
      <article v-for="doc in documents" :key="doc.id" class="doc-row">
        <strong>{{ doc.title }}（{{ doc.version_label }}）</strong>
        <span>导入时间：{{ new Date(doc.imported_at).toLocaleString("zh-CN") }}</span>
      </article>
    </div>
    <EmptyState v-else />
  </section>
</template>

<style scoped>
.panel {
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 18px;
  display: grid;
  gap: 14px;
}
.grid {
  display: grid;
  gap: 10px;
}
.history-title {
  margin: 4px 0 0;
}
.doc-list {
  display: grid;
  gap: 8px;
}
.doc-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid #e0ddce;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #596257;
}
</style>

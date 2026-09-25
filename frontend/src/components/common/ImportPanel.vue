<script setup lang="ts">
import { ref } from "vue";
import { usePolicyParser, type ParsedSection } from "../../hooks/usePolicyParser";

const emit = defineEmits<{ (e: "imported", payload: { sections: ParsedSection[] }): void }>();
const raw = ref("");
const { parseSections } = usePolicyParser();

function doImport() {
  emit("imported", { sections: parseSections(raw.value) });
}
</script>

<template>
  <div class="import-panel">
    <textarea
      v-model="raw"
      rows="8"
      placeholder="在此粘贴隐私政策全文，将按「第X条 / 数字编号 / 一、」等规则自动分段…"
    ></textarea>
    <button type="button" class="import-btn" :disabled="!raw.trim()" @click="doImport">解析并导入</button>
  </div>
</template>

<style scoped>
.import-panel {
  display: grid;
  gap: 10px;
}
textarea {
  font: inherit;
  border: 1px solid #c9c4b2;
  border-radius: 8px;
  padding: 10px 12px;
  resize: vertical;
}
.import-btn {
  justify-self: start;
  background: #2f6b4b;
  color: #f5f1e6;
  border: 0;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 800;
  cursor: pointer;
}
.import-btn:disabled {
  background: #b6b8ae;
  cursor: not-allowed;
}
</style>

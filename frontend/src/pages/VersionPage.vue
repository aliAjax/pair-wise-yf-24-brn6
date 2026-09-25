<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useHandoverStore } from "../stores/HandoverStore";
import SummaryDiff from "../components/common/SummaryDiff.vue";
import CategoryChip from "../components/common/CategoryChip.vue";
import ReviewChecklist from "../components/common/ReviewChecklist.vue";
import HandoverHistory from "../components/common/HandoverHistory.vue";
import { isReopenedItem } from "../hooks/useReopenDiff";
import { formatDate } from "../utils/formatters";

const store = useHandoverStore();
const { riskItems, owners, draftChanges, policyVersions, loading, lastError } = storeToRefs(store);
const notice = ref("");

const nextVersionLabel = computed(() => {
  const numbers = policyVersions.value
    .map((version) => /v(\d+)\.(\d+)/.exec(version.version_label))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => Number(match[1]) * 100 + Number(match[2]));
  const max = numbers.length ? Math.max(...numbers) : 300;
  const major = Math.floor(max / 100);
  const minor = (max % 100) + 1;
  return `v${major}.${minor}`;
});

const reopenedItems = computed(() => riskItems.value.filter(isReopenedItem));

onMounted(() => {
  store.load();
});

async function release() {
  notice.value = "";
  const saved = await store.releaseDraftVersion(nextVersionLabel.value);
  if (saved) {
    notice.value = `政策 ${saved.version_label} 已发布：内容改过的条款原确认结论回到待处理，新旧摘要已对照展示。`;
  } else {
    notice.value = lastError.value;
  }
}
</script>

<template>
  <section class="version-page">
    <div v-if="loading" class="loading">正在读取政策版本…</div>
    <template v-else>
      <div class="panel">
        <h2>政策新版草稿（{{ draftChanges.length }} 处变化）</h2>
        <p class="hint">
          发布后：同一条款（按条款编号匹配）内容改过的，原来的确认结论自动回到「待处理」，并保留旧摘要形成新旧对照；新增条款进入未分配。
        </p>
        <div class="change-list">
          <article v-for="change in draftChanges" :key="change.clause_key" class="change-row">
            <header>
              <span class="clause-no">{{ change.clause_no }}</span>
              <strong>{{ change.heading }}</strong>
              <CategoryChip :category="change.category" />
              <span v-if="!change.old_summary" class="new-flag">新增条款</span>
            </header>
            <SummaryDiff :old-summary="change.old_summary || null" :new-summary="change.new_summary" />
          </article>
        </div>
        <div class="release-bar">
          <span>将发布为 <strong>{{ nextVersionLabel }}</strong></span>
          <button class="primary-btn" type="button" @click="release">发布新版并重置确认结论</button>
        </div>
        <p v-if="notice" class="notice" :class="{ error: lastError }">{{ notice }}</p>
      </div>

      <div class="panel">
        <h2>改版后重回待处理的条目（{{ reopenedItems.length }}）</h2>
        <ReviewChecklist :items="reopenedItems" :owners="owners" :selected-ids="[]" />
      </div>

      <div class="panel">
        <h2>版本与交接记录</h2>
        <div class="version-list">
          <article v-for="version in policyVersions" :key="version.id" class="version-row">
            <strong>{{ version.version_label }}</strong>
            <time>{{ formatDate(version.released_at) }}</time>
            <span>{{ version.changes.length }} 处条款变化</span>
          </article>
        </div>
        <h2 class="history-title">最近交接</h2>
        <HandoverHistory :records="store.handoverRecords" :limit="5" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.version-page {
  display: grid;
  gap: 16px;
}
.panel {
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 18px;
}
.hint {
  margin: 0 0 12px;
  color: #8a8775;
  font-size: 13px;
  line-height: 1.6;
}
.change-list {
  display: grid;
  gap: 12px;
}
.change-row {
  border: 1px solid #e0ddce;
  border-radius: 8px;
  padding: 12px 14px;
  display: grid;
  gap: 10px;
}
.change-row header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.clause-no {
  font-weight: 800;
  color: #274335;
}
.new-flag {
  background: #dfe8f4;
  color: #27416a;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
  padding: 1px 8px;
}
.release-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #d8d6c8;
}
.primary-btn {
  background: #7d4d18;
  color: #f5f1e6;
  border: 0;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.notice {
  margin: 12px 0 0;
  border-radius: 6px;
  background: #e4efe4;
  color: #244b31;
  padding: 8px 12px;
  font-size: 13px;
}
.notice.error {
  background: #f6d5d5;
  color: #8f2222;
}
.version-list {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}
.version-row {
  display: flex;
  gap: 14px;
  align-items: baseline;
  font-size: 13px;
  color: #596257;
}
.version-row time {
  color: #8a8775;
}
.history-title {
  margin-top: 6px;
}
.loading {
  padding: 40px;
  text-align: center;
  color: #8a8775;
}
</style>

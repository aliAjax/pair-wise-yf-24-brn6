<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useHandoverStore } from "../stores/HandoverStore";
import ReviewChecklist from "../components/common/ReviewChecklist.vue";
import { ReviewStatus, ReviewStatusText } from "../constants/ReviewStatus";
import { isReopenedItem } from "../hooks/useReopenDiff";

const store = useHandoverStore();
const { riskItems, owners, loading } = storeToRefs(store);
const status = ref<string>("OPEN");
const reopenOnly = ref(false);

onMounted(store.load);

const rows = computed(() =>
  riskItems.value.filter((item) => {
    if (reopenOnly.value) return isReopenedItem(item);
    return item.status === status.value;
  })
);

function exportMarkdown() {
  const lines = [
    "# 审阅清单摘要",
    "",
    ...rows.value.map(
      (item) =>
        `- [${ReviewStatusText[item.status as keyof typeof ReviewStatusText] ?? item.status}] ${item.clause_no} ${item.heading}（负责人：${
          item.owner_id === null ? "未分配" : owners.value.find((o) => o.id === item.owner_id)?.name ?? item.owner_id
        }）：${item.summary}`
    )
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "review-checklist.md";
  anchor.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <section class="review-page panel">
    <div class="head">
      <h2>按状态处理备注</h2>
      <button class="export-btn" type="button" @click="exportMarkdown">导出 Markdown 摘要</button>
    </div>
    <div class="filters">
      <button
        v-for="value in ReviewStatus"
        :key="value"
        type="button"
        :class="{ active: !reopenOnly && status === value }"
        @click="reopenOnly = false; status = value"
      >
        {{ ReviewStatusText[value] }}
      </button>
      <button type="button" :class="{ active: reopenOnly }" @click="reopenOnly = true">
        改版重回待处理
      </button>
    </div>
    <p v-if="loading">正在加载…</p>
    <ReviewChecklist v-else :items="rows" :owners="owners" :selected-ids="[]" />
  </section>
</template>

<style scoped>
.panel {
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 18px;
}
.head,
.filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.head {
  justify-content: space-between;
}
.filters {
  margin: 10px 0 14px;
}
.filters button {
  border: 1px solid #c9c4b2;
  background: #fff;
  color: #596257;
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
}
.filters button.active {
  background: #2f6b4b;
  border-color: #2f6b4b;
  color: #f5f1e6;
  font-weight: 800;
}
.export-btn {
  border: 1px solid #2f6b4b;
  background: transparent;
  color: #2f6b4b;
  border-radius: 6px;
  padding: 6px 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>

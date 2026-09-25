<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useHandoffStore } from "../stores/HandoffStore";
import { PolicyCategory, PolicyCategoryText } from "../constants/PolicyCategory";
import type { PolicyCategory as Category } from "../types/PolicyCategory";
import type { RiskItem } from "../types/RiskItem";
import HandoffPanel from "../components/common/HandoffPanel.vue";
import HandoffHistory from "../components/common/HandoffHistory.vue";
import OwnerBoard from "../components/common/OwnerBoard.vue";
import RiskItemCard from "../components/common/RiskItemCard.vue";
import EmptyState from "../components/common/EmptyState.vue";
import { isOpenRisk } from "../services/handoffService";
import type { ClauseVersionInput } from "../services/handoffService";

const store = useHandoffStore();

const activeCategory = ref<Category>("DATA_COLLECTION");
const statusFilter = ref<"ALL" | "OPEN" | "CONFIRMED" | "REOPENED">("ALL");
const reevaluateMessage = ref("");

onMounted(() => {
  store.load();
});

const categoryItems = computed(() => store.categories(activeCategory.value));
const filteredItems = computed(() => {
  return categoryItems.value.filter((item) => {
    if (statusFilter.value === "OPEN") return isOpenRisk(item);
    if (statusFilter.value === "CONFIRMED") return item.status === "CONFIRMED";
    if (statusFilter.value === "REOPENED") return item.reopened_at !== null;
    return true;
  });
});

const countsByCategory = computed(() => {
  const result: Record<Category, { open: number; confirmed: number }> = {
    DATA_COLLECTION: { open: 0, confirmed: 0 },
    SHARING: { open: 0, confirmed: 0 },
    RETENTION: { open: 0, confirmed: 0 }
  };
  store.riskItems.forEach((item) => {
    if (isOpenRisk(item)) result[item.category].open += 1;
    else if (item.status === "CONFIRMED") result[item.category].confirmed += 1;
  });
  return result;
});

// 模拟政策新版发布：对当前分类下「已确认」条款生成一段改动后的摘要，
// 触发“同一条款内容改过后原确认结论退回待处理，并展示新旧摘要”
async function simulatePolicyUpdate() {
  reevaluateMessage.value = "";
  const versions: ClauseVersionInput[] = store.riskItems
    .filter((item) => item.category === activeCategory.value && item.status === "CONFIRMED")
    .map((item: RiskItem) => ({
      clause_key: item.clause_key,
      document_id: item.document_id + 1,
      summary: `【v3.1 修订】${item.summary}（新版对用途/范围作出调整）`
    }));
  if (versions.length === 0) {
    reevaluateMessage.value = "当前分类下没有已确认条款可演示退回；请先在已确认条目上操作。";
    return;
  }
  const result = await store.reevaluatePolicy(versions);
  reevaluateMessage.value = `政策新版比对完成：${result.reopened.length} 条已确认结论因条款改动退回待处理，新旧摘要已并列展示。`;
}
</script>

<template>
  <div class="handoff-page">
    <section class="top-grid">
      <HandoffPanel />
      <OwnerBoard />
    </section>

    <section class="panel risk-board">
      <div class="risk-board-head">
        <h2>风险条目（随交接流转）</h2>
        <button class="ghost-btn" type="button" @click="simulatePolicyUpdate">模拟政策新版条款改动</button>
      </div>
      <p v-if="reevaluateMessage" class="reevaluate-msg">{{ reevaluateMessage }}</p>

      <div class="tabs">
        <button
          v-for="category in PolicyCategory"
          :key="category"
          type="button"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ PolicyCategoryText[category] }}
          <span class="tab-count">待办 {{ countsByCategory[category].open }} / 已确认 {{ countsByCategory[category].confirmed }}</span>
        </button>
      </div>

      <div class="filters">
        <button
          v-for="option in (['ALL','OPEN','REOPENED','CONFIRMED'] as const)"
          :key="option"
          type="button"
          :class="{ active: statusFilter === option }"
          @click="statusFilter = option"
        >
          {{ { ALL: "全部", OPEN: "未处理", REOPENED: "新版退回", CONFIRMED: "已确认" }[option] }}
        </button>
      </div>

      <div v-if="filteredItems.length" class="risk-list">
        <RiskItemCard v-for="item in filteredItems" :key="item.id" :item="item" />
      </div>
      <EmptyState v-else />
    </section>

    <HandoffHistory />
  </div>
</template>

<style scoped>
.handoff-page { display: grid; gap: 18px; }
.top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.panel { background: #fbfaf4; border: 1px solid #d8d6c8; border-radius: 8px; padding: 18px; }
.risk-board-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.ghost-btn { background: transparent; border: 1px solid #274335; color: #274335; border-radius: 6px; padding: 7px 14px; cursor: pointer; font-weight: 700; }
.ghost-btn:hover { background: #eaf1e8; }
.reevaluate-msg { background: #fbeee2; border: 1px dashed #d2762e; border-radius: 6px; padding: 8px 10px; font-size: 13px; color: #a04e14; }
.tabs, .filters { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0; }
.tabs button, .filters button { border: 1px solid #c9c4b2; background: #fff; border-radius: 6px; padding: 8px 12px; cursor: pointer; font: inherit; color: #3a413c; display: inline-flex; gap: 8px; align-items: center; }
.tabs button.active, .filters button.active { background: #274335; border-color: #274335; color: #f5f1e6; }
.tab-count { font-size: 12px; opacity: 0.85; }
.risk-list { display: grid; gap: 12px; }
@media (max-width: 900px) { .top-grid { grid-template-columns: 1fr; } }
</style>

<script setup lang="ts">
import type { RiskItem } from "../../types/RiskItem";
import type { Owner } from "../../types/Owner";
import RiskTag from "./RiskTag.vue";
import StatusBadge from "./StatusBadge.vue";
import CategoryChip from "./CategoryChip.vue";
import HandoverWitnessCard from "./HandoverWitnessCard.vue";
import SummaryDiff from "./SummaryDiff.vue";
import { isReopenedItem } from "../../hooks/useReopenDiff";
import { formatDate } from "../../utils/formatters";

const props = defineProps<{
  items: RiskItem[];
  owners: Owner[];
  selectedIds: number[];
  disabled?: boolean;
  showCheckbox?: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-one", id: number, checked: boolean): void;
}>();

function ownerName(ownerId: number | null): string {
  if (ownerId === null) return "未分配";
  return props.owners.find((owner) => owner.id === ownerId)?.name ?? `#${ownerId}`;
}

function isSelected(id: number): boolean {
  return props.selectedIds.includes(id);
}
</script>

<template>
  <div class="checklist">
    <article v-for="item in items" :key="item.id" class="risk-row" :class="{ 'risk-row--reopened': isReopenedItem(item) }">
      <label v-if="showCheckbox" class="risk-check">
        <input
          type="checkbox"
          :checked="isSelected(item.id)"
          :disabled="disabled"
          @change="emit('toggle-one', item.id, ($event.target as HTMLInputElement).checked)"
        />
      </label>
      <div class="risk-main">
        <header class="risk-head">
          <span class="risk-no">{{ item.clause_no }}</span>
          <strong>{{ item.heading }}</strong>
          <CategoryChip :category="item.category" />
          <RiskTag :level="item.risk_level" small />
          <StatusBadge :value="item.status" />
          <span class="risk-version">{{ item.version_label }}</span>
        </header>

        <SummaryDiff v-if="isReopenedItem(item)" :old-summary="item.previous_summary" :new-summary="item.summary" />
        <p v-else class="risk-summary">{{ item.summary }}</p>

        <div v-if="isReopenedItem(item)" class="reopen-tip">
          条款内容已在政策新版中改过，原确认结论已回到待处理；原结论由 {{ item.confirmed_by ?? "—" }}
          于 {{ item.confirmed_at ? formatDate(item.confirmed_at) : "—" }} 作出：{{ item.confirmed_comment ?? "无备注" }}
        </div>

        <footer class="risk-foot">
          <span>当前负责人：<strong :class="{ unassigned: item.owner_id === null }">{{ ownerName(item.owner_id) }}</strong></span>
          <span v-if="item.status !== 'OPEN' && item.confirmed_by">
            原结论：{{ item.confirmed_by }} · {{ item.confirmed_at ? formatDate(item.confirmed_at) : "—" }}
          </span>
          <span class="risk-updated">最近更新：{{ formatDate(item.updated_at) }}</span>
        </footer>

        <HandoverWitnessCard v-if="item.latest_witness" :witness="item.latest_witness" />
      </div>
    </article>
    <div v-if="items.length === 0" class="checklist-empty">当前筛选条件下没有可交接的风险条目。</div>
  </div>
</template>

<style scoped>
.checklist {
  display: grid;
  gap: 12px;
}
.risk-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 14px 16px;
}
.risk-row--reopened {
  border-color: #d8a14e;
  box-shadow: 0 0 0 2px rgba(216, 161, 78, 0.18);
}
.risk-check {
  padding-top: 4px;
}
.risk-main {
  display: grid;
  gap: 8px;
  min-width: 0;
}
.risk-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.risk-no {
  font-weight: 800;
  color: #274335;
}
.risk-version {
  margin-left: auto;
  color: #8a8775;
  font-size: 12px;
}
.risk-summary {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #3f443d;
}
.reopen-tip {
  border-radius: 6px;
  background: #fdf5e6;
  color: #8a5a12;
  font-size: 12px;
  line-height: 1.55;
  padding: 8px 10px;
}
.risk-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: #6d7267;
  font-size: 12px;
}
.risk-foot .unassigned {
  color: #9c4116;
}
.risk-updated {
  margin-left: auto;
}
.checklist-empty {
  border: 1px dashed #b8b09f;
  border-radius: 8px;
  padding: 22px;
  text-align: center;
  color: #8a8775;
}
@media (max-width: 760px) {
  .risk-updated { margin-left: 0; }
  .risk-version { margin-left: 0; }
}
</style>

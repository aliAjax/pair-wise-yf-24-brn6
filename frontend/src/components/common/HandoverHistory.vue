<script setup lang="ts">
import type { HandoverRecord } from "../../types/HandoverRecord";
import { RiskCategoryText } from "../../constants/RiskCategory";
import { formatDate } from "../../utils/formatters";

defineProps<{ records: HandoverRecord[]; limit?: number }>();
</script>

<template>
  <div class="history">
    <article v-for="record in records.slice(0, limit ?? records.length)" :key="record.id" class="history-row">
      <header>
        <strong>#{{ record.id }} 批量交接</strong>
        <time>{{ formatDate(record.created_at) }}</time>
      </header>
      <p class="route">
        {{ record.from_owner_id === null ? "未分配" : `原负责人 #${record.from_owner_id}` }}
        → {{ record.to_owner_name }}
        <span class="count">（{{ record.risk_ids.length }} 条）</span>
      </p>
      <div class="scope">
        <span v-for="category in record.scope" :key="category" class="scope-chip">
          {{ RiskCategoryText[category] }}
        </span>
      </div>
      <p class="note">{{ record.note }}</p>
      <p class="operator">交接发起人：{{ record.operator }}</p>
    </article>
    <div v-if="records.length === 0" class="history-empty">暂无交接记录。</div>
  </div>
</template>

<style scoped>
.history {
  display: grid;
  gap: 10px;
}
.history-row {
  border-left: 3px solid #2f6b4b;
  background: #fbfaf4;
  border-radius: 0 8px 8px 0;
  padding: 10px 14px;
}
.history-row header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.history-row time {
  color: #8a8775;
  font-size: 12px;
}
.route {
  margin: 6px 0;
  font-size: 13px;
  font-weight: 700;
}
.count {
  font-weight: 400;
  color: #6d7267;
}
.scope {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}
.scope-chip {
  background: #eceadf;
  border-radius: 4px;
  color: #5b563f;
  font-size: 12px;
  padding: 1px 8px;
}
.note {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #3f443d;
}
.operator {
  margin: 6px 0 0;
  font-size: 12px;
  color: #8a8775;
}
.history-empty {
  color: #8a8775;
  font-size: 13px;
}
</style>

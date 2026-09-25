<script setup lang="ts">
import { PolicyCategoryText } from "../../constants/PolicyCategory";
import { formatOwner } from "../../utils/formatters";
import type { RiskItem } from "../../types/RiskItem";
import RiskTag from "./RiskTag.vue";
import StatusBadge from "./StatusBadge.vue";

defineProps<{ item: RiskItem }>();
</script>

<template>
  <article class="risk-card" :class="`risk-${item.risk_level.toLowerCase()}`">
    <header class="risk-card-head">
      <div>
        <span class="clause-no">{{ item.clause_no }}</span>
        <strong>{{ item.title }}</strong>
      </div>
      <div class="risk-card-tags">
        <span class="badge cat">{{ PolicyCategoryText[item.category] }}</span>
        <RiskTag :level="item.risk_level" />
        <StatusBadge :value="item.status" />
      </div>
    </header>

    <p class="summary"><em>当前摘要：</em>{{ item.summary }}</p>

    <div v-if="item.previous_summary && item.reopened_at" class="reopen-box">
      <StatusBadge value="REOPENED_BY_POLICY_UPDATE" />
      <p><em>旧版摘要：</em>{{ item.previous_summary }}</p>
      <p class="muted">新版摘要：{{ item.summary }}</p>
    </div>

    <div v-if="item.confirmed_conclusion && item.status === 'CONFIRMED'" class="conclusion-box">
      <p><em>原确认结论：</em>{{ item.confirmed_conclusion }}</p>
      <p class="muted">确认人：{{ item.confirmed_by }} · {{ item.confirmed_at ? new Date(item.confirmed_at).toLocaleString("zh-CN") : "" }}</p>
    </div>

    <div v-if="item.witness" class="witness-box">
      <p><em>接手见证：</em>{{ item.witness.note || "已核对原结论，接手留痕。" }}</p>
      <p class="muted">见证人：{{ item.witness.owner }} · {{ new Date(item.witness.handed_at).toLocaleString("zh-CN") }}</p>
    </div>

    <footer class="risk-card-foot">
      <span>负责人：<b>{{ formatOwner(item.assignee) }}</b></span>
      <span v-if="item.reopened_at" class="reopen-text">已于 {{ new Date(item.reopened_at).toLocaleString("zh-CN") }} 退回待处理</span>
    </footer>
  </article>
</template>

<style scoped>
.risk-card { border: 1px solid #d8d6c8; border-left-width: 5px; border-radius: 8px; padding: 14px 16px; background: #fbfaf4; display: grid; gap: 8px; }
.risk-low { border-left-color: #6aa07b; }
.risk-medium { border-left-color: #c9a13b; }
.risk-high { border-left-color: #d2762e; }
.risk-critical { border-left-color: #c0392b; }
.risk-card-head { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.risk-card-head strong { font-size: 15px; }
.clause-no { color: #7d4d18; font-weight: 800; margin-right: 8px; }
.risk-card-tags { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.badge.cat { background: #e9e3d2; color: #5c4a1e; }
.summary { margin: 0; font-size: 14px; }
.reopen-box { background: #fbeee2; border: 1px dashed #d2762e; border-radius: 6px; padding: 8px 10px; margin: 0; font-size: 13px; }
.reopen-box p { margin: 4px 0 0; }
.conclusion-box { background: #eef4ec; border-radius: 6px; padding: 8px 10px; font-size: 13px; margin: 0; }
.conclusion-box p { margin: 2px 0; }
.witness-box { background: #eef0f6; border: 1px solid #ccd4e6; border-radius: 6px; padding: 8px 10px; font-size: 13px; margin: 0; }
.witness-box p { margin: 2px 0; }
.risk-card-foot { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 13px; color: #596257; }
.reopen-text { color: #c06a1b; font-weight: 700; }
em { font-style: normal; color: #7d4d18; font-weight: 700; }
.muted { color: #7b8178; }
</style>

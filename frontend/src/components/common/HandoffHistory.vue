<script setup lang="ts">
import { computed } from "vue";
import { useHandoffStore } from "../../stores/HandoffStore";
import { PolicyCategoryText } from "../../constants/PolicyCategory";
import { formatDateTimeOrDash, formatOwner } from "../../utils/formatters";

const store = useHandoffStore();
const records = computed(() => store.recordsByTime);
</script>

<template>
  <div class="panel history-panel">
    <h2>交接记录</h2>
    <ul v-if="records.length" class="timeline">
      <li v-for="record in records" :key="record.id">
        <div class="t-head">
          <span class="badge cat">{{ PolicyCategoryText[record.category] }}</span>
          <strong>{{ formatOwner(record.from_owner) }} → {{ record.to_owner }}</strong>
          <time>{{ formatDateTimeOrDash(record.created_at) }}</time>
        </div>
        <p class="note">{{ record.note || "（未填写交接说明）" }}</p>
        <p class="meta">待办转走 {{ record.moved_open_count }} 条 · 接手见证 {{ record.witnessed_count }} 条</p>
      </li>
    </ul>
    <p v-else class="empty-hint">暂无交接记录</p>
  </div>
</template>

<style scoped>
.history-panel { background: #fbfaf4; border: 1px solid #d8d6c8; border-radius: 8px; padding: 18px; }
.timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.timeline li { border-left: 3px solid #d39b46; padding: 2px 0 2px 12px; }
.t-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.t-head time { margin-left: auto; font-size: 12px; color: #7b8178; }
.badge.cat { background: #e9e3d2; color: #5c4a1e; display: inline-flex; align-items: center; min-height: 22px; border-radius: 999px; padding: 1px 9px; font-size: 12px; font-weight: 800; }
.note { margin: 6px 0 2px; font-size: 13px; }
.meta { margin: 0; font-size: 12px; color: #7b8178; }
.empty-hint { color: #7b8178; font-size: 13px; }
</style>

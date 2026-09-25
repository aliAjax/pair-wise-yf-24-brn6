<script setup lang="ts">
import { computed } from "vue";
import { useHandoffStore } from "../../stores/HandoffStore";
import { UNASSIGNED_OWNER_TEXT } from "../../constants/statusText";
import { formatDateTimeOrDash, formatOwner } from "../../utils/formatters";

const store = useHandoffStore();

const rows = computed(() => store.ownerSummaries);
const totalOpen = computed(() => rows.value.reduce((sum, row) => sum + row.open_count, 0));
</script>

<template>
  <div class="panel owner-board">
    <h2>负责人视图</h2>
    <p class="hint">汇总每人剩余待办与最近交接时间；旧记录没有负责人时归入「{{ UNASSIGNED_OWNER_TEXT }}」。剩余待办合计：<b>{{ totalOpen }}</b></p>
    <table>
      <thead>
        <tr>
          <th>负责人</th>
          <th>剩余待办</th>
          <th>已确认</th>
          <th>最近交接时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.owner" :class="{ unassigned: row.owner === '' }">
          <td>{{ formatOwner(row.owner) }}</td>
          <td><span class="open-count" :class="{ zero: row.open_count === 0 }">{{ row.open_count }}</span></td>
          <td>{{ row.confirmed_count }}</td>
          <td>{{ formatDateTimeOrDash(row.last_handoff_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.owner-board { background: #fbfaf4; border: 1px solid #d8d6c8; border-radius: 8px; padding: 18px; }
.hint { margin: 0 0 12px; font-size: 13px; color: #596257; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th, td { text-align: left; padding: 9px 10px; border-top: 1px solid #e4e0d3; }
th { font-size: 12px; color: #7d4d18; border-top: 0; }
tr.unassigned td:first-child { color: #a04e14; font-weight: 800; }
.open-count { display: inline-block; min-width: 26px; text-align: center; background: #fbeee2; color: #a04e14; border-radius: 999px; padding: 2px 10px; font-weight: 800; }
.open-count.zero { background: #eef4ec; color: #246b3b; }
</style>

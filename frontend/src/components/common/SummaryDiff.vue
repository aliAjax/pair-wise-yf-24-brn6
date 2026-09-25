<script setup lang="ts">
defineProps<{ oldSummary: string | null; newSummary: string }>();
</script>

<template>
  <div class="summary-diff">
    <div v-if="oldSummary" class="summary-row">
      <span class="summary-label summary-label--old">旧版摘要</span>
      <p>{{ oldSummary }}</p>
    </div>
    <div class="summary-row">
      <span class="summary-label summary-label--new">新版摘要</span>
      <p>{{ newSummary }}</p>
    </div>
  </div>
</template>

<style scoped>
.summary-diff {
  display: grid;
  gap: 8px;
}
.summary-row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 10px;
  align-items: start;
  border-radius: 6px;
  padding: 8px 10px;
}
.summary-label {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 6px;
  text-align: center;
  white-space: nowrap;
}
.summary-label--old {
  background: #f1e3df;
  color: #8f4a35;
}
.summary-label--new {
  background: #e0ede1;
  color: #274b33;
}
.summary-row:has(.summary-label--old) {
  background: #fdf5f2;
}
.summary-row:has(.summary-label--new) {
  background: #f4f9f3;
}
.summary-row p {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
}
</style>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ value: string }>();
const label = computed(() => {
  const map: Record<string, string> = {
    OPEN: "待处理",
    CONFIRMED: "已确认",
    IGNORED: "已忽略",
    RESOLVED: "已解决",
    REOPENED_BY_POLICY_UPDATE: "新版改动 · 退回待处理",
    READY: "READY",
    LOCAL_DATA: "本地数据"
  };
  return map[props.value] ?? props.value.replace(/_/g, " ");
});
const cls = computed(() => `badge status-${props.value.toLowerCase()}`);
</script>

<template><span :class="cls">{{ label }}</span></template>

<style scoped>
.badge { display: inline-flex; align-items: center; min-height: 24px; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 800; background: #e4efe4; color: #244b31; }
.status-open, .status-reopened_by_policy_update { background: #fbeee2; color: #a04e14; }
.status-confirmed { background: #e4efe4; color: #244b31; }
.status-ignored, .status-resolved { background: #e9e7dd; color: #6b6b5e; }
</style>

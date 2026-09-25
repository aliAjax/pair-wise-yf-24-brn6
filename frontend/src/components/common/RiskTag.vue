<script setup lang="ts">
import { computed } from "vue";
import { formatRisk } from "../../utils/formatters";

const props = defineProps<{ level: string; small?: boolean }>();

const className = computed(() => `risk-tag risk-${props.level.toLowerCase()}${props.small ? " risk-tag--small" : ""}`);
</script>

<template>
  <span :class="className">{{ formatRisk(level) }}风险</span>
</template>

<style scoped>
.risk-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}
.risk-tag--small {
  padding: 1px 8px;
  font-size: 11px;
}
.risk-low { background: #e4efe4; color: #244b31; }
.risk-medium { background: #fdf0d5; color: #8a5a12; }
.risk-high { background: #fbe0cf; color: #9c4116; }
.risk-critical { background: #f6d5d5; color: #8f2222; }
</style>

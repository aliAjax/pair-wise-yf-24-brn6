<script setup lang="ts">
import { computed } from "vue";
import { formatRisk } from "../../utils/formatters";

const props = defineProps<{ level: string; title?: string }>();
const cls = computed(() => `risk-tag risk-tag-${props.level.toLowerCase()}`);
</script>

<template>
  <span :class="cls" :title="title ?? formatRisk(level)">{{ formatRisk(level) }}</span>
</template>

<style scoped>
.risk-tag { display: inline-flex; align-items: center; min-height: 24px; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 800; }
.risk-tag-low { background: #e4efe4; color: #244b31; }
.risk-tag-medium { background: #f6edcf; color: #7a5d12; }
.risk-tag-high { background: #fae3d0; color: #a04e14; }
.risk-tag-critical { background: #f7d9d5; color: #8c241a; }
</style>

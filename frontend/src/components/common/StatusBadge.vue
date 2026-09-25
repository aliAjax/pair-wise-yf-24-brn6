<script setup lang="ts">
import { computed } from "vue";
import { formatReviewStatus } from "../../utils/formatters";

const props = defineProps<{ value: string }>();

const className = computed(() => `status-badge status-${props.value.toLowerCase()}`);
</script>

<template>
  <span :class="className">{{ formatReviewStatus(value) }}</span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: 999px;
  padding: 2px 12px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}
.status-open { background: #fdf0d5; color: #8a5a12; }
.status-confirmed { background: #e4efe4; color: #244b31; }
.status-ignored { background: #e7e7e2; color: #5d5f58; }
.status-resolved { background: #dfe8f4; color: #27416a; }
</style>

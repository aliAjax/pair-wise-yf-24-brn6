<script setup lang="ts">
import type { RiskCategory } from "../../types/RiskCategory";
import { RiskCategoryText } from "../../constants/RiskCategory";

defineProps<{ category: RiskCategory }>();
</script>

<template>
  <span class="category-chip">{{ RiskCategoryText[category] }}</span>
</template>

<style scoped>
.category-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  background: #eceadf;
  color: #5b563f;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
</style>

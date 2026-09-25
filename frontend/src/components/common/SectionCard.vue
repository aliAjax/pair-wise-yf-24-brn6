<script setup lang="ts">
import RiskTag from "./RiskTag.vue";

defineProps<{
  sectionNo: string;
  heading: string;
  content: string;
  riskLevel?: string;
}>();
</script>

<template>
  <article class="section-card">
    <header>
      <span class="no">{{ sectionNo }}</span>
      <strong>{{ heading }}</strong>
      <RiskTag v-if="riskLevel" :level="riskLevel" small />
    </header>
    <p>{{ content }}</p>
  </article>
</template>

<style scoped>
.section-card {
  border: 1px solid #e0ddce;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fff;
}
header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.no {
  color: #274335;
  font-weight: 800;
}
p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #3f443d;
  white-space: pre-wrap;
}
</style>

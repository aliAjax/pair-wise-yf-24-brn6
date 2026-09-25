<script setup lang="ts">
import type { OwnerSummary } from "../../services/handoverService";
import { RiskCategoryText, RiskCategoryOrder } from "../../constants/RiskCategory";
import { formatDateTimeOrDash } from "../../utils/formatters";

defineProps<{ summaries: OwnerSummary[] }>();
defineEmits<{ (e: "select", ownerId: number | null): void }>();
</script>

<template>
  <div class="owner-board">
    <button
      v-for="summary in summaries"
      :key="summary.ownerId ?? 'unassigned'"
      class="owner-card"
      :class="{ 'owner-card--unassigned': summary.ownerId === null }"
      type="button"
      @click="$emit('select', summary.ownerId)"
    >
      <header>
        <strong>{{ summary.ownerName }}</strong>
        <span class="open-pill" :class="{ zero: summary.openCount === 0 }">{{ summary.openCount }} 待办</span>
      </header>
      <p class="team">{{ summary.team }}</p>
      <ul class="cat-line">
        <li v-for="category in RiskCategoryOrder" :key="category">
          <span>{{ RiskCategoryText[category] }}</span>
          <strong>{{ summary.openByCategory[category] }}</strong>
        </li>
      </ul>
      <footer>
        <span>名下条目 {{ summary.total }}</span>
        <span>最近交接 {{ formatDateTimeOrDash(summary.latestHandoverAt) }}</span>
      </footer>
    </button>
  </div>
</template>

<style scoped>
.owner-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
}
.owner-card {
  text-align: left;
  color: inherit;
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 14px 16px;
  display: grid;
  gap: 10px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.owner-card:hover {
  border-color: #2f6b4b;
  box-shadow: 0 2px 10px rgba(47, 107, 75, 0.12);
}
.owner-card--unassigned {
  border-style: dashed;
  border-color: #c98a3f;
  background: #fdf8ef;
}
.owner-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.open-pill {
  border-radius: 999px;
  background: #fdf0d5;
  color: #8a5a12;
  font-size: 12px;
  font-weight: 800;
  padding: 2px 10px;
}
.open-pill.zero {
  background: #e4efe4;
  color: #244b31;
}
.team {
  margin: 0;
  font-size: 12px;
  color: #7c8175;
}
.cat-line {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.cat-line li {
  display: grid;
  gap: 2px;
  background: #f1efe4;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: #6d7267;
}
.cat-line strong {
  font-size: 16px;
  color: #274335;
}
.owner-card footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: #8a8775;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useHandoverStore } from "../stores/HandoverStore";
import ReviewChecklist from "../components/common/ReviewChecklist.vue";
import { RiskCategoryOrder, RiskCategoryText } from "../constants/RiskCategory";
import type { RiskCategory } from "../types/RiskCategory";

const store = useHandoverStore();
const { riskItems, owners, loading } = storeToRefs(store);
const category = ref<RiskCategory>("COLLECTION");

onMounted(store.load);

const rows = computed(() => riskItems.value.filter((item) => item.category === category.value));
</script>

<template>
  <section class="risks-page panel">
    <h2>按分类打标签</h2>
    <div class="tabs">
      <button
        v-for="value in RiskCategoryOrder"
        :key="value"
        type="button"
        :class="{ active: category === value }"
        @click="category = value"
      >
        {{ RiskCategoryText[value] }}
      </button>
    </div>
    <p v-if="loading">正在加载…</p>
    <ReviewChecklist v-else :items="rows" :owners="owners" :selected-ids="[]" />
  </section>
</template>

<style scoped>
.panel {
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 18px;
}
.tabs {
  display: flex;
  gap: 8px;
  margin: 10px 0 14px;
}
.tabs button {
  border: 1px solid #c9c4b2;
  background: #fff;
  color: #596257;
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
}
.tabs button.active {
  background: #2f6b4b;
  border-color: #2f6b4b;
  color: #f5f1e6;
  font-weight: 800;
}
</style>

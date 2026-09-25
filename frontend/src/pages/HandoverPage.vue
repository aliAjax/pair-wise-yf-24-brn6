<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useHandoverStore } from "../stores/HandoverStore";
import { useHandoverFilters } from "../hooks/useHandoverFilters";
import { RiskCategoryOrder, RiskCategoryText } from "../constants/RiskCategory";
import type { RiskCategory } from "../types/RiskCategory";
import ReviewChecklist from "../components/common/ReviewChecklist.vue";
import HandoverHistory from "../components/common/HandoverHistory.vue";

const store = useHandoverStore();
const { riskItems, owners, handoverRecords, loading, lastError } = storeToRefs(store);

const {
  selectedCategories,
  fromOwnerId,
  includeUnassigned,
  selectedRiskIds,
  toOwnerId,
  handoverNote,
  candidates,
  allSelected,
  toggleAll,
  toggleOne,
  resetSelection
} = useHandoverFilters(() => riskItems.value);

const notice = ref<string>("");

onMounted(() => {
  store.load();
});

function toggleCategory(category: RiskCategory, checked: boolean) {
  if (checked) {
    if (!selectedCategories.value.includes(category)) selectedCategories.value.push(category);
  } else {
    selectedCategories.value = selectedCategories.value.filter((value) => value !== category);
  }
}

async function submitHandover() {
  notice.value = "";
  if (toOwnerId.value === null) {
    notice.value = "请选择接手人后再提交批量交接";
    return;
  }
  const record = await store.batchHandover({
    riskIds: selectedRiskIds.value,
    toOwnerId: toOwnerId.value,
    note: handoverNote.value
  });
  if (record) {
    const ownerName = owners.value.find((owner) => owner.id === record.to_owner_id)?.name ?? "";
    notice.value = `已将 ${record.risk_ids.length} 条风险条目交接给 ${ownerName}，交接说明已随记录保存。`;
    resetSelection();
  } else {
    notice.value = lastError.value;
  }
}
</script>

<template>
  <section class="handover-page">
    <div v-if="loading" class="loading">正在读取本地交接数据…</div>

    <template v-else>
      <div class="panel">
        <h2>1. 按分类与原负责人圈定交接范围</h2>
        <div class="filter-grid">
          <fieldset>
            <legend>条款分类（批量范围）</legend>
            <label v-for="category in RiskCategoryOrder" :key="category" class="check-label">
              <input
                type="checkbox"
                :checked="selectedCategories.includes(category)"
                @change="toggleCategory(category, ($event.target as HTMLInputElement).checked)"
              />
              {{ RiskCategoryText[category] }}
            </label>
          </fieldset>
          <fieldset>
            <legend>原负责人</legend>
            <select v-model="fromOwnerId">
              <option :value="null">不限（所有负责人）</option>
              <option v-for="owner in owners.filter((o) => o.active)" :key="owner.id" :value="owner.id">
                {{ owner.name }}（{{ owner.team }}）
              </option>
            </select>
            <label class="check-label">
              <input type="checkbox" v-model="includeUnassigned" />
              同时包含未分配（旧记录）
            </label>
          </fieldset>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2>2. 勾选待交接条目（{{ candidates.length }} 条候选，已选 {{ selectedRiskIds.length }} 条）</h2>
          <label class="check-all">
            <input type="checkbox" :checked="allSelected" @change="toggleAll(($event.target as HTMLInputElement).checked)" />
            全选当前候选
          </label>
        </div>
        <ReviewChecklist
          :items="candidates"
          :owners="owners"
          :selected-ids="selectedRiskIds"
          show-checkbox
          @toggle-one="toggleOne"
        />
      </div>

      <div class="panel">
        <h2>3. 指派接手人并填写交接说明</h2>
        <div class="handover-form">
          <label class="field">
            <span>接手人</span>
            <select v-model="toOwnerId">
              <option :value="null">请选择接手人…</option>
              <option v-for="owner in owners.filter((o) => o.active)" :key="owner.id" :value="owner.id">
                {{ owner.name }}（{{ owner.team }}）
              </option>
            </select>
          </label>
          <label class="field field--note">
            <span>交接说明（必填，会写进接手见证）</span>
            <textarea
              v-model="handoverNote"
              rows="3"
              placeholder="例如：广告共享专项 DPA 11 月到期复审，合作方清单见合规库 G-2026-018。"
            ></textarea>
          </label>
          <button class="primary-btn" type="button" :disabled="selectedRiskIds.length === 0" @click="submitHandover">
            批量交接 {{ selectedRiskIds.length }} 条
          </button>
        </div>
        <p v-if="notice" class="notice" :class="{ error: lastError }">{{ notice }}</p>
        <p class="rule-tip">
          规则：未处理（待处理）条目随人转走；已确认/已忽略/已解决条目保留原结论，并自动生成接手人见证。
        </p>
      </div>

      <div class="panel">
        <h2>最近交接</h2>
        <HandoverHistory :records="handoverRecords" :limit="5" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.handover-page {
  display: grid;
  gap: 16px;
}
.panel {
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 18px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
fieldset {
  border: 1px solid #e0ddce;
  border-radius: 8px;
  padding: 10px 14px 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
legend {
  font-size: 12px;
  font-weight: 800;
  color: #7d4d18;
  padding: 0 6px;
}
.check-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.check-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
}
.handover-form {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 14px;
  align-items: start;
}
.field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
}
.field select,
.field textarea {
  font: inherit;
  font-weight: 400;
  border: 1px solid #c9c4b2;
  border-radius: 6px;
  padding: 8px 10px;
  background: #fff;
}
.field--note {
  grid-column: 1 / -1;
}
.primary-btn {
  grid-column: 1 / -1;
  justify-self: start;
  background: #2f6b4b;
  color: #f5f1e6;
  border: 0;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.primary-btn:disabled {
  background: #b6b8ae;
  cursor: not-allowed;
}
.notice {
  margin: 12px 0 0;
  border-radius: 6px;
  background: #e4efe4;
  color: #244b31;
  padding: 8px 12px;
  font-size: 13px;
}
.notice.error {
  background: #f6d5d5;
  color: #8f2222;
}
.rule-tip {
  margin: 10px 0 0;
  color: #8a8775;
  font-size: 12px;
}
.loading {
  padding: 40px;
  text-align: center;
  color: #8a8775;
}
@media (max-width: 760px) {
  .filter-grid,
  .handover-form {
    grid-template-columns: 1fr;
  }
}
</style>

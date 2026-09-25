<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useHandoverStore } from "../stores/HandoverStore";
import OwnerBoard from "../components/common/OwnerBoard.vue";
import ReviewChecklist from "../components/common/ReviewChecklist.vue";
import HandoverHistory from "../components/common/HandoverHistory.vue";
import StatCard from "../components/common/StatCard.vue";

const store = useHandoverStore();
const { riskItems, owners, handoverRecords, ownerSummaries, loading } = storeToRefs(store);

// null 表示当前聚焦「未分配」桶。
const focusedOwnerId = ref<number | null>(null);
const showUnassignedOnly = ref(false);

onMounted(() => {
  store.load();
});

const totalOpen = computed(() => riskItems.value.filter((item) => item.status === "OPEN").length);
const unassignedOpen = computed(
  () => riskItems.value.filter((item) => item.owner_id === null && item.status === "OPEN").length
);
const reopenedCount = computed(
  () =>
    riskItems.value.filter(
      (item) => item.status === "OPEN" && item.reopened_at !== null && item.previous_summary !== null
    ).length
);

const focusedRows = computed(() =>
  riskItems.value.filter((item) =>
    showUnassignedOnly.value ? item.owner_id === null : item.owner_id === focusedOwnerId.value
  )
);

const focusedHistory = computed(() =>
  handoverRecords.value.filter((record) =>
    showUnassignedOnly.value
      ? record.from_owner_id === null
      : record.to_owner_id === focusedOwnerId.value
  )
);

const focusTitle = computed(() => {
  if (showUnassignedOnly.value) return "未分配";
  return owners.value.find((owner) => owner.id === focusedOwnerId.value)?.name ?? "未分配";
});

function focusBoard(ownerId: number | null) {
  focusedOwnerId.value = ownerId;
  showUnassignedOnly.value = ownerId === null;
}
</script>

<template>
  <section class="owner-page">
    <div v-if="loading" class="loading">正在汇总负责人视图…</div>
    <template v-else>
      <div class="metrics">
        <StatCard label="剩余待办总数" :value="totalOpen" />
        <StatCard label="未分配待办" :value="unassignedOpen" />
        <StatCard label="改版后重回待处理" :value="reopenedCount" />
      </div>

      <div class="panel">
        <h2>负责人视图</h2>
        <p class="hint">点击卡片查看该同事名下条目与最近交接；旧记录没有负责人时统一归入「未分配」。</p>
        <OwnerBoard :summaries="ownerSummaries" @select="focusBoard" />
      </div>

      <div class="panel" v-if="focusedOwnerId !== null || showUnassignedOnly">
        <div class="panel-head">
          <h2>{{ focusTitle }} · 名下风险条目</h2>
          <button class="ghost-btn" type="button" @click="focusedOwnerId = null; showUnassignedOnly = false">
            清除聚焦
          </button>
        </div>
        <ReviewChecklist :items="focusedRows" :owners="owners" :selected-ids="[]" />
        <h2 class="history-title">该负责人相关交接</h2>
        <HandoverHistory :records="focusedHistory" :limit="5" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.owner-page {
  display: grid;
  gap: 16px;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.panel {
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 18px;
  display: grid;
  gap: 14px;
}
.hint {
  margin: 0;
  color: #8a8775;
  font-size: 13px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.history-title {
  margin-top: 6px;
}
.ghost-btn {
  background: transparent;
  border: 1px solid #c9c4b2;
  border-radius: 6px;
  color: #596257;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
}
.loading {
  padding: 40px;
  text-align: center;
  color: #8a8775;
}
@media (max-width: 760px) {
  .metrics {
    grid-template-columns: 1fr;
  }
}
</style>

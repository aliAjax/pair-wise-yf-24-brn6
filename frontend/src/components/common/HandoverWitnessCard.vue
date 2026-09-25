<script setup lang="ts">
import type { HandoverWitness } from "../../types/HandoverWitness";
import { formatDate } from "../../utils/formatters";

defineProps<{ witness: HandoverWitness | null }>();
</script>

<template>
  <div v-if="witness" class="witness">
    <div class="witness-head">
      <span class="witness-icon" aria-hidden="true">✓</span>
      <strong>接手见证</strong>
      <time>{{ formatDate(witness.handed_over_at) }}</time>
    </div>
    <p>{{ witness.note }}</p>
    <p class="witness-sign">接手人：{{ witness.to_owner_name }}</p>
  </div>
  <div v-else class="witness witness--none">暂无接手见证</div>
</template>

<style scoped>
.witness {
  border: 1px dashed #c3bda8;
  border-left-width: 4px;
  border-left-color: #2f6b4b;
  border-radius: 8px;
  padding: 10px 12px;
  background: #f8f7ef;
  font-size: 13px;
}
.witness--none {
  border-left-color: #c3bda8;
  color: #8a8775;
}
.witness-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.witness-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2f6b4b;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
}
.witness time {
  margin-left: auto;
  color: #8a8775;
  font-size: 12px;
}
.witness p {
  margin: 6px 0 0;
  line-height: 1.55;
}
.witness-sign {
  color: #596257;
  font-size: 12px;
}
</style>

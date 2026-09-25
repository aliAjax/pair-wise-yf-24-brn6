<script setup lang="ts">
import { ref } from "vue";
import DiffViewer from "../components/common/DiffViewer.vue";

const oldText = ref("第三条 我们收集的信息\n注册时收集手机号。\n日志保存 6 个月。");
const newText = ref("第三条 我们收集的信息\n注册时收集手机号与设备标识。\n新增智能客服语音录音。\n日志保存 6 个月。");
</script>

<template>
  <section class="compare-page panel">
    <h2>左右文本对比</h2>
    <div class="editors">
      <label>
        <span>旧版</span>
        <textarea v-model="oldText" rows="8"></textarea>
      </label>
      <label>
        <span>新版</span>
        <textarea v-model="newText" rows="8"></textarea>
      </label>
    </div>
    <h3>差异视图</h3>
    <DiffViewer :old-text="oldText" :new-text="newText" />
  </section>
</template>

<style scoped>
.panel {
  background: #fbfaf4;
  border: 1px solid #d8d6c8;
  border-radius: 10px;
  padding: 18px;
  display: grid;
  gap: 12px;
}
.editors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
}
textarea {
  font: inherit;
  font-weight: 400;
  border: 1px solid #c9c4b2;
  border-radius: 8px;
  padding: 10px;
}
@media (max-width: 760px) {
  .editors {
    grid-template-columns: 1fr;
  }
}
</style>

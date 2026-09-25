<script setup lang="ts">
import { computed } from "vue";
import { useTextDiff, type TextDiffLine } from "../../hooks/useTextDiff";

const props = defineProps<{ oldText: string; newText: string }>();
const { diffText } = useTextDiff();

const lines = computed<TextDiffLine[]>(() => diffText(props.oldText, props.newText));
</script>

<template>
  <div class="diff-viewer">
    <div v-for="(line, index) in lines" :key="index" class="diff-line" :class="`diff-line--${line.type}`">
      <span class="gutter">{{ line.type === "added" ? "+" : line.type === "removed" ? "-" : " " }}</span>
      <span class="text">{{ line.text || " " }}</span>
    </div>
  </div>
</template>

<style scoped>
.diff-viewer {
  border: 1px solid #e0ddce;
  border-radius: 8px;
  overflow: hidden;
  font-family: "SFMono-Regular", Consolas, "PingFang SC", monospace;
  font-size: 12.5px;
}
.diff-line {
  display: grid;
  grid-template-columns: 24px 1fr;
  white-space: pre-wrap;
  line-height: 1.6;
}
.gutter {
  text-align: center;
  user-select: none;
}
.diff-line--added {
  background: #e8f3e8;
}
.diff-line--removed {
  background: #f9e7e1;
}
.diff-line--unchanged {
  background: #fff;
}
</style>

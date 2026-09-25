<script setup lang="ts">
import { type Component, computed, ref } from "vue";
import { routes } from "./router/routes";
import StatusBadge from "./components/common/StatusBadge.vue";
import StatCard from "./components/common/StatCard.vue";
import HandoffPage from "./pages/HandoffPage.vue";
import DocumentsPage from "./pages/DocumentsPage.vue";
import ComparePage from "./pages/ComparePage.vue";
import RisksPage from "./pages/RisksPage.vue";
import ReviewPage from "./pages/ReviewPage.vue";

const pageMap: Record<string, Component> = {
  "/handoff": HandoffPage,
  "/documents": DocumentsPage,
  "/compare": ComparePage,
  "/risks": RisksPage,
  "/review": ReviewPage
};

const active = ref<string>(routes[0]?.route ?? "/handoff");
const current = computed(() => routes.find((route) => route.route === active.value) ?? routes[0]);
const pageComponent = computed(() => pageMap[active.value] ?? HandoffPage);
const isHandoff = computed(() => active.value === "/handoff");
</script>

<template>
  <div class="shell">
    <aside>
      <div class="brand">隐私政策差异对比器</div>
      <nav>
        <button v-for="route in routes" :key="route.route" :class="{ active: active === route.route }" @click="active = route.route">{{ route.name }}</button>
      </nav>
    </aside>
    <main class="page">
      <section class="page-head"><div><p class="eyebrow">policy-diff</p><h1>{{ current?.name }}</h1></div><StatusBadge value="LOCAL_DATA" /></section>
      <component :is="pageComponent" v-if="isHandoff" />
      <template v-else>
        <section class="metrics"><StatCard label="核心模型" :value="4" /><StatCard label="共享枚举" :value="4" /><StatCard label="审阅待办" :value="0" /></section>
        <section class="workbench">
          <div class="panel wide"><h2>{{ current?.name }}</h2><p>该模块请从左侧「交接台」进入交接、负责人视图与政策新版退回演示。</p></div>
          <div class="panel"><h2>联动检查</h2><p>页面、store、API、构造器、日志模板和枚举常量均按提示词拆分。</p></div>
        </section>
      </template>
    </main>
  </div>
</template>

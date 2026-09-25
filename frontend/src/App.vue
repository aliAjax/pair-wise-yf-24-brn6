<script setup lang="ts">
import { computed, ref } from "vue";
import { routes } from "./router/routes";
import StatusBadge from "./components/common/StatusBadge.vue";
import StatCard from "./components/common/StatCard.vue";
import { useHandoverStore } from "./stores/HandoverStore";
import { storeToRefs } from "pinia";

function readHashRoute(): string {
  const hash = window.location.hash.replace(/^#/, "");
  return routes.some((route) => route.route === hash) ? hash : routes[0].route;
}

const active = ref<string>(readHashRoute());
function navigate(route: string) {
  window.location.hash = route;
}
window.addEventListener("hashchange", () => {
  active.value = readHashRoute();
});

const current = computed(() => routes.find((route) => route.route === active.value) ?? routes[0]);
const currentComponent = computed(() => current.value.component);

const handoverStore = useHandoverStore();
const { riskItems, handoverRecords } = storeToRefs(handoverStore);
handoverStore.load();

const openCount = computed(() => riskItems.value.filter((item) => item.status === "OPEN").length);
</script>

<template>
  <div class="shell">
    <aside>
      <div class="brand">隐私政策差异对比器</div>
      <nav>
        <template v-for="(group, label) in { '审阅': routes.filter(r => !r.group), '交接台': routes.filter(r => r.group) }" :key="label">
          <p class="nav-group">{{ label }}</p>
          <button
            v-for="route in group"
            :key="route.route"
            :class="{ active: active === route.route }"
            @click="navigate(route.route)"
          >
            {{ route.name }}
          </button>
        </template>
      </nav>
    </aside>
    <main class="page">
      <section class="page-head">
        <div>
          <p class="eyebrow">policy-diff · handover desk</p>
          <h1>{{ current?.name }}</h1>
        </div>
        <StatusBadge value="LOCAL_DATA" />
      </section>
      <section class="metrics">
        <StatCard label="风险条目" :value="riskItems.length" />
        <StatCard label="剩余待办" :value="openCount" />
        <StatCard label="交接记录" :value="handoverRecords.length" />
      </section>
      <component :is="currentComponent" />
    </main>
  </div>
</template>

import type { Component } from "vue";
import DocumentsPage from "../pages/DocumentsPage.vue";
import ComparePage from "../pages/ComparePage.vue";
import RisksPage from "../pages/RisksPage.vue";
import ReviewPage from "../pages/ReviewPage.vue";
import HandoverPage from "../pages/HandoverPage.vue";
import OwnerPage from "../pages/OwnerPage.vue";
import VersionPage from "../pages/VersionPage.vue";

export interface AppRoute {
  name: string;
  route: string;
  component: Component;
  group?: string;
}

export const routes: AppRoute[] = [
  { name: "交接台", route: "/handovers", component: HandoverPage, group: "交接" },
  { name: "负责人视图", route: "/owners", component: OwnerPage, group: "交接" },
  { name: "政策新版", route: "/versions", component: VersionPage, group: "交接" },
  { name: "文档导入", route: "/documents", component: DocumentsPage },
  { name: "版本对比", route: "/compare", component: ComparePage },
  { name: "风险标注", route: "/risks", component: RisksPage },
  { name: "审阅清单", route: "/review", component: ReviewPage }
];

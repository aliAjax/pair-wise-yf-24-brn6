import { defineStore } from "pinia";
import { listHandoffRecord, saveHandoffRecord } from "../api/HandoffRecord";
import { listRiskItem, saveRiskItems } from "../api/RiskItem";
import type { PolicyCategory } from "../types/PolicyCategory";
import {
  buildOwnerSummaries,
  submitConfirm,
  submitHandoff,
  submitPolicyReevaluation
} from "../controllers/handoffController";
import { isOpenRisk } from "../services/handoffService";
import type { HandoffInput } from "../services/handoffService";
import type { ClauseVersionInput } from "../services/handoffService";
import { UNASSIGNED_OWNER } from "../constants/statusText";

export interface HandoffFormState extends HandoffInput {
  categories: PolicyCategory[]; // 批量交接可勾选多个分类，逐类生成批次
}

export const useHandoffStore = defineStore("handoff", {
  state: () => ({
    riskItems: [] as Awaited<ReturnType<typeof listRiskItem>>,
    handoffRecords: [] as Awaited<ReturnType<typeof listHandoffRecord>>,
    loading: false,
    last_error: ""
  }),
  getters: {
    openItems(state) {
      return state.riskItems.filter(isOpenRisk);
    },
    unassignedItems(state) {
      return state.riskItems.filter((item) => (item.assignee ?? UNASSIGNED_OWNER) === UNASSIGNED_OWNER);
    },
    reopenedItems(state) {
      return state.riskItems.filter((item) => item.reopened_at !== null);
    },
    ownerSummaries(state) {
      return buildOwnerSummaries(state.riskItems, state.handoffRecords);
    },
    categories(state) {
      return (category: PolicyCategory) => state.riskItems.filter((item) => item.category === category);
    },
    recordsByTime(state) {
      return [...state.handoffRecords].sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  },
  actions: {
    async load() {
      this.loading = true;
      this.last_error = "";
      try {
        const [items, records] = await Promise.all([listRiskItem(), listHandoffRecord()]);
        this.riskItems = items;
        this.handoffRecords = records;
      } finally {
        this.loading = false;
      }
    },
    async createHandoff(input: HandoffInput) {
      const result = submitHandoff(this.riskItems, this.handoffRecords, input);
      this.riskItems = result.rows;
      this.handoffRecords = [...this.handoffRecords, result.record];
      await Promise.all([
        saveRiskItems(this.riskItems),
        saveHandoffRecord(result.record)
      ]);
      return result;
    },
    async reevaluatePolicy(versions: ClauseVersionInput[]) {
      const result = submitPolicyReevaluation(this.riskItems, versions);
      this.riskItems = result.rows;
      await saveRiskItems(this.riskItems);
      return result;
    },
    async confirmRisk(id: number, owner: string, conclusion: string) {
      this.riskItems = submitConfirm(this.riskItems, id, owner, conclusion);
      await saveRiskItems(this.riskItems);
    }
  }
});

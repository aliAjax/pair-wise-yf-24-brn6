import { defineStore } from "pinia";
import type { RiskItem } from "../types/RiskItem";
import type { HandoverRecord } from "../types/HandoverRecord";
import type { Owner } from "../types/Owner";
import type { PolicyVersion, PolicyVersionChange } from "../types/PolicyVersion";
import type { RiskCategory } from "../types/RiskCategory";
import { listRiskItem, saveRiskItems } from "../api/RiskItem";
import { listHandoverRecord, saveHandoverRecord } from "../api/HandoverRecord";
import { listOwner } from "../api/Owner";
import {
  listDraftVersionChanges,
  listPolicyVersion,
  savePolicyVersion
} from "../api/PolicyVersion";
import { nextId, writeLog } from "../api/_storage";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import {
  applyBatchHandover,
  applyVersionRelease,
  buildOwnerSummaries,
  createVersionSnapshot,
  type OwnerSummary
} from "../services/handoverService";

/** 纯前端演示：交接发起人固定为当前登录同事，实际接入账号体系后替换。 */
const CURRENT_OPERATOR = "当前值班同事";

interface BatchHandoverPayload {
  riskIds: number[];
  toOwnerId: number;
  note: string;
}

export const useHandoverStore = defineStore("handover", {
  state: () => ({
    riskItems: [] as RiskItem[],
    owners: [] as Owner[],
    handoverRecords: [] as HandoverRecord[],
    policyVersions: [] as PolicyVersion[],
    draftChanges: [] as readonly PolicyVersionChange[],
    loading: false,
    operator: CURRENT_OPERATOR,
    lastError: "" as string
  }),
  getters: {
    ownerNameById: (state) => (ownerId: number | null) =>
      state.owners.find((owner) => owner.id === ownerId)?.name ?? null,
    ownerSummaries(state): OwnerSummary[] {
      return buildOwnerSummaries(state.riskItems, state.handoverRecords, state.owners);
    },
    openItems(state): RiskItem[] {
      return state.riskItems.filter((item) => item.status === "OPEN");
    },
    categories(): RiskCategory[] {
      return ["COLLECTION", "SHARING", "RETENTION"];
    }
  },
  actions: {
    async load() {
      this.loading = true;
      const [riskItems, owners, records, versions, draftChanges] = await Promise.all([
        listRiskItem(),
        listOwner(),
        listHandoverRecord(),
        listPolicyVersion(),
        Promise.resolve(listDraftVersionChanges())
      ]);
      this.riskItems = riskItems;
      this.owners = owners;
      this.handoverRecords = records;
      this.policyVersions = versions;
      this.draftChanges = draftChanges;
      this.loading = false;
    },

    /** 按数据收集/共享/保存期限分类批量指派接手人，填写交接说明。 */
    async batchHandover(payload: BatchHandoverPayload): Promise<HandoverRecord | null> {
      this.lastError = "";
      try {
        const { items, record } = applyBatchHandover(this.riskItems, this.owners, {
          ...payload,
          operator: this.operator,
          nowIso: new Date().toISOString(),
          nextRecordId: nextId(this.handoverRecords)
        });
        this.riskItems = await saveRiskItems(items);
        const saved = await saveHandoverRecord(record);
        this.handoverRecords = [saved, ...this.handoverRecords];
        return saved;
      } catch (error) {
        this.lastError = error instanceof Error ? error.message : String(error);
        return null;
      }
    },

    /** 政策新版发布：改动条款的确认结论回到待处理，并展示新旧摘要。 */
    async releaseDraftVersion(versionLabel: string): Promise<PolicyVersion | null> {
      this.lastError = "";
      try {
        const nowIso = new Date().toISOString();
        const changed = applyVersionRelease(
          this.riskItems,
          this.draftChanges,
          versionLabel,
          nowIso,
          nextId(this.riskItems)
        );
        const snapshot = createVersionSnapshot(
          this.draftChanges,
          versionLabel,
          nowIso,
          nextId(this.policyVersions)
        );
        this.riskItems = await saveRiskItems(changed);
        const saved = await savePolicyVersion(snapshot);
        this.policyVersions = [saved, ...this.policyVersions];
        writeLog(LOG_TEMPLATES.PolicyVersion[1], { version: versionLabel });
        return saved;
      } catch (error) {
        this.lastError = error instanceof Error ? error.message : String(error);
        return null;
      }
    }
  }
});

import type { RiskItem } from "../types/RiskItem";
import type { HandoverRecord } from "../types/HandoverRecord";
import type { Owner } from "../types/Owner";
import type { PolicyVersion, PolicyVersionChange } from "../types/PolicyVersion";
import type { RiskCategory } from "../types/RiskCategory";
import {
  ConcludedReviewStatuses,
  UnhandledReviewStatuses
} from "../constants/ReviewStatus";
import { createDefaultHandoverRecord } from "../constructors/HandoverRecordConstructor";
import {
  createDefaultHandoverWitness,
  createDefaultRiskItem
} from "../constructors/RiskItemConstructor";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export interface HandoverFilter {
  categories: RiskCategory[];
  fromOwnerId: number | null; // null = 未分配；undefined 语义由调用方包裹
  includeUnassigned: boolean;
}

export interface BatchHandoverInput {
  riskIds: number[];
  toOwnerId: number;
  note: string;
  operator: string;
  nowIso: string;
  nextRecordId: number;
}

export interface OwnerSummary {
  ownerId: number | null;
  ownerName: string;
  team: string;
  total: number;
  openCount: number;
  openByCategory: Record<RiskCategory, number>;
  latestHandoverAt: string | null;
}

export function createEmptyCategoryCount(): Record<RiskCategory, number> {
  return { COLLECTION: 0, SHARING: 0, RETENTION: 0 };
}

/** 交接台候选条目：按分类 + 原负责人筛选，勾选后批量指派。 */
export function selectHandoverCandidates(items: RiskItem[], filter: HandoverFilter): RiskItem[] {
  return items.filter((item) => {
    if (!filter.categories.includes(item.category)) return false;
    if (filter.includeUnassigned && item.owner_id === null) return true;
    return item.owner_id === filter.fromOwnerId;
  });
}

export class HandoverValidationError extends Error {
  code: string;
  constructor(code: keyof typeof ERROR_MESSAGES) {
    super(ERROR_MESSAGES[code]);
    this.code = ERROR_CODES[code];
  }
}

/**
 * 批量交接核心规则：
 * - 未处理条目（OPEN）：负责人直接转走，不带见证。
 * - 已确认/已忽略/已解决条目：结论与确认信息保留，负责人转走并留下接手见证。
 */
export function applyBatchHandover(
  items: RiskItem[],
  owners: Owner[],
  input: BatchHandoverInput
): { items: RiskItem[]; record: HandoverRecord } {
  if (input.riskIds.length === 0) throw new HandoverValidationError("HANDOVER_EMPTY_SELECTION");
  const toOwner = owners.find((owner) => owner.id === input.toOwnerId);
  if (!toOwner) throw new HandoverValidationError("HANDOVER_OWNER_REQUIRED");
  if (!input.note.trim()) throw new HandoverValidationError("HANDOVER_NOTE_REQUIRED");

  const idSet = new Set(input.riskIds);
  const targets = items.filter((item) => idSet.has(item.id));
  const scope = Array.from(new Set(targets.map((item) => item.category)));
  const fromOwnerIds = Array.from(new Set(targets.map((item) => item.owner_id)));
  // 批量范围内原负责人应一致（未分配与某负责人不会混在同一次交接中）。
  const fromOwnerId = fromOwnerIds.length === 1 ? fromOwnerIds[0] : null;

  const record = createDefaultHandoverRecord({
    id: input.nextRecordId,
    risk_ids: input.riskIds,
    scope,
    from_owner_id: fromOwnerId,
    to_owner_id: toOwner.id,
    to_owner_name: toOwner.name,
    note: input.note.trim(),
    operator: input.operator,
    created_at: input.nowIso,
    risk_statuses: targets.map((item) => ({ risk_id: item.id, status: item.status }))
  });

  const nextItems = items.map((item) => {
    if (!idSet.has(item.id)) return item;
    const isUnhandled = (UnhandledReviewStatuses as readonly string[]).includes(item.status);
    const isConcluded = (ConcludedReviewStatuses as readonly string[]).includes(item.status);
    if (isConcluded) {
      return {
        ...item,
        owner_id: toOwner.id,
        updated_at: input.nowIso,
        // 原确认结论（confirmed_*）原样保留，仅追加接手见证。
        latest_witness: createDefaultHandoverWitness({
          record_id: record.id,
          from_owner_id: item.owner_id,
          to_owner_id: toOwner.id,
          to_owner_name: toOwner.name,
          note: `接手见证：已核对原确认结论继续有效。${input.note.trim()}`,
          handed_over_at: input.nowIso
        })
      };
    }
    if (isUnhandled) {
      // 未处理风险随人转走：状态不动、结论字段不动。
      return { ...item, owner_id: toOwner.id, updated_at: input.nowIso };
    }
    return { ...item, owner_id: toOwner.id, updated_at: input.nowIso };
  });

  return { items: nextItems, record };
}

/**
 * 政策新版发布：同一条款内容改过时，原确认结论回到待处理，并写入新旧摘要；
 * 新版新增条款（旧摘要为空且无现存条目）以未分配待办进入清单。
 */
export function applyVersionRelease(
  items: RiskItem[],
  changes: readonly PolicyVersionChange[],
  versionLabel: string,
  nowIso: string,
  nextRiskId: number
): RiskItem[] {
  if (changes.length === 0) throw new HandoverValidationError("VERSION_NO_CHANGES");

  let nextId = nextRiskId;
  const nextItems = [...items];
  for (const change of changes) {
    const index = nextItems.findIndex((item) => item.clause_key === change.clause_key);
    if (index >= 0) {
      const current = nextItems[index];
      const wasConcluded = (ConcludedReviewStatuses as readonly string[]).includes(current.status);
      const contentChanged = change.old_summary !== change.new_summary;
      // 内容未变化（如仅排版调整）不触发结论重置。
      const shouldReopen = wasConcluded && contentChanged;
      nextItems[index] = {
        ...current,
        summary: change.new_summary,
        previous_summary: contentChanged ? change.old_summary || current.previous_summary : current.previous_summary,
        version_label: versionLabel,
        // 仅已确认/已忽略/已解决结论且条款确有改动时回到待处理；本来就待处理的条目保持原状继续跟进。
        status: shouldReopen ? "OPEN" : current.status,
        reopened_at: shouldReopen ? nowIso : current.reopened_at,
        updated_at: nowIso
        // confirmed_by / confirmed_at / confirmed_comment 保留，便于回看原结论。
      };
    } else if (change.old_summary === "") {
      // 新版新增条款（且现存清单中没有同 clause_key 条目）以未分配待办进入清单。
      nextItems.push(
        createDefaultRiskItem({
          id: nextId++,
          clause_key: change.clause_key,
          clause_no: change.clause_no,
          heading: change.heading,
          category: change.category,
          risk_level: "MEDIUM",
          version_label: versionLabel,
          summary: change.new_summary,
          status: "OPEN",
          owner_id: null, // 新增风险先进入未分配，由负责人视图认领/指派。
          created_at: nowIso,
          updated_at: nowIso
        })
      );
    }
  }
  return nextItems;
}

function latestHandoverFor(
  records: HandoverRecord[],
  predicate: (record: HandoverRecord) => boolean
): string | null {
  return records.reduce<string | null>((latest, record) => {
    if (!predicate(record)) return latest;
    if (!latest || record.created_at > latest) return record.created_at;
    return latest;
  }, null);
}

/** 负责人视图：剩余待办数（按分类拆分）+ 最近交接时间；无负责人条目归入未分配。 */
export function buildOwnerSummaries(
  items: RiskItem[],
  records: HandoverRecord[],
  owners: Owner[]
): OwnerSummary[] {
  const summaries: OwnerSummary[] = owners
    .filter((owner) => owner.active)
    .map((owner) => {
      const owned = items.filter((item) => item.owner_id === owner.id);
      const openByCategory = createEmptyCategoryCount();
      owned
        .filter((item) => item.status === "OPEN")
        .forEach((item) => {
          openByCategory[item.category] += 1;
        });
      return {
        ownerId: owner.id,
        ownerName: owner.name,
        team: owner.team,
        total: owned.length,
        openCount: owned.filter((item) => item.status === "OPEN").length,
        openByCategory,
        latestHandoverAt: latestHandoverFor(records, (record) => record.to_owner_id === owner.id)
      };
    });

  const unassigned = items.filter((item) => item.owner_id === null);
  const openByCategory = createEmptyCategoryCount();
  unassigned
    .filter((item) => item.status === "OPEN")
    .forEach((item) => {
      openByCategory[item.category] += 1;
    });
  summaries.push({
    ownerId: null,
    ownerName: "未分配",
    team: "旧记录或新版新增条款，等待指派负责人",
    total: unassigned.length,
    openCount: unassigned.filter((item) => item.status === "OPEN").length,
    openByCategory,
    latestHandoverAt: latestHandoverFor(records, (record) => record.from_owner_id === null)
  });
  return summaries;
}

export function createVersionSnapshot(
  changes: readonly PolicyVersionChange[],
  versionLabel: string,
  nowIso: string,
  nextVersionId: number
): PolicyVersion {
  return {
    id: nextVersionId,
    version_label: versionLabel,
    released_at: nowIso,
    changes: changes.map((change) => ({ ...change }))
  };
}

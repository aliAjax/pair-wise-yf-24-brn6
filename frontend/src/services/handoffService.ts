import type { HandoffRecord } from "../types/HandoffRecord";
import type { PolicyCategory } from "../types/PolicyCategory";
import type { RiskItem, RiskWitness } from "../types/RiskItem";
import { createDefaultRiskWitness } from "../constructors/RiskItemConstructor";
import { createDefaultHandoffRecord } from "../constructors/HandoffRecordConstructor";
import { HANDOFF_ERROR_CODES, toServiceError } from "./handoffErrors";
import { logHandoff } from "./handoffLogger";

// 未处理状态：这些条目随交接人转走
export const OPEN_REVIEW_STATUSES = new Set(["OPEN", "IGNORED"]);

export interface HandoffInput {
  category: PolicyCategory;
  from_owner: string;   // 交出负责人；空串表示从未分配池领取
  to_owner: string;     // 接手人
  note: string;         // 交接说明
}

export interface HandoffResult {
  record: HandoffRecord;
  moved: RiskItem[];
  witnessed: RiskItem[];
  rows: RiskItem[];
}

// 政策新版某条款的最新摘要：与已确认时的摘要不一致即视为内容改动
export interface ClauseVersionInput {
  clause_key: string;
  document_id: number;
  summary: string;
}

export interface ReopenResult {
  reopened: RiskItem[];
  unchanged: RiskItem[];
  rows: RiskItem[];
}

export function isOpenRisk(item: RiskItem): boolean {
  return OPEN_REVIEW_STATUSES.has(item.status);
}

export function isUnassigned(item: RiskItem): boolean {
  return (item.assignee ?? "") === "";
}

function nextHandoffId(records: HandoffRecord[]): number {
  return records.reduce((max, record) => Math.max(max, record.id), 0) + 1;
}

/**
 * 按分类批量交接：
 * - 未处理风险条目（当前负责人 = from_owner）随人转走，assignee 改为接手人；
 * - 已确认条目保留原结论，不改变状态，只追加接手见证。
 */
export function applyHandoff(
  items: RiskItem[],
  records: HandoffRecord[],
  input: HandoffInput
): HandoffResult {
  if (!input.to_owner.trim()) {
    throw toServiceError(HANDOFF_ERROR_CODES.HANDOFF_TARGET_REQUIRED);
  }
  if (!input.category) {
    throw toServiceError(HANDOFF_ERROR_CODES.CATEGORY_REQUIRED);
  }

  const moved: RiskItem[] = [];
  const witnessed: RiskItem[] = [];
  const now = new Date().toISOString();
  const record = createDefaultHandoffRecord({
    id: nextHandoffId(records),
    category: input.category,
    from_owner: input.from_owner,
    to_owner: input.to_owner.trim(),
    note: input.note.trim(),
    created_at: now
  });

  const rows = items.map((item) => {
    if (item.category !== input.category) return item;
    // 从未分配池领取：from_owner 为空时匹配无负责人条目
    if ((item.assignee ?? "") !== input.from_owner) return item;

    if (isOpenRisk(item)) {
      const movedItem: RiskItem = { ...item, assignee: record.to_owner, updated_at: now };
      moved.push(movedItem);
      return movedItem;
    }

    if (item.status === "CONFIRMED") {
      const witness: RiskWitness = createDefaultRiskWitness({
        owner: record.to_owner,
        handoff_id: record.id,
        note: record.note,
        handed_at: now
      });
      const witnessedItem: RiskItem = { ...item, witness, updated_at: now };
      witnessed.push(witnessedItem);
      return witnessedItem;
    }

    return item;
  });

  if (moved.length === 0 && witnessed.length === 0) {
    throw toServiceError(HANDOFF_ERROR_CODES.NO_OPEN_RISK_TO_HANDOFF);
  }

  record.moved_open_count = moved.length;
  record.witnessed_count = witnessed.length;

  logHandoff("RiskItem", 1, { handoff_id: record.id, moved: moved.length, witnessed: witnessed.length });
  logHandoff("HandoffRecord", 0, { id: record.id, category: record.category });
  if (witnessed.length > 0) logHandoff("HandoffRecord", 2, { id: record.id, count: witnessed.length });

  return { record, moved, witnessed, rows };
}

/**
 * 政策新版比对：同一条款（clause_key）内容改动时，
 * 原来的确认结论回到待处理，并把新旧摘要都挂到条目上展示。
 */
export function reevaluatePolicyVersion(items: RiskItem[], versions: ClauseVersionInput[]): ReopenResult {
  const byKey = new Map(versions.map((version) => [version.clause_key, version]));
  const reopened: RiskItem[] = [];
  const unchanged: RiskItem[] = [];
  const now = new Date().toISOString();

  const rows = items.map((item) => {
    const version = byKey.get(item.clause_key);
    if (!version) return item;
    const changed = version.summary.trim() !== item.summary.trim();
    if (item.status === "CONFIRMED" && changed) {
      const reopenedItem: RiskItem = {
        ...item,
        status: "OPEN",
        document_id: version.document_id,
        previous_summary: item.summary,
        summary: version.summary,
        reopened_at: now,
        witness: item.witness,
        // 原确认结论保留在 confirmed_* 字段中作为历史，不清除
        updated_at: now
      };
      reopened.push(reopenedItem);
      return reopenedItem;
    }
    if (changed) {
      // 未处理条目仅刷新摘要，不产生退回动作
      const refreshed: RiskItem = {
        ...item,
        document_id: version.document_id,
        summary: version.summary,
        updated_at: now
      };
      unchanged.push(refreshed);
      return refreshed;
    }
    unchanged.push(item);
    return item;
  });

  if (reopened.length > 0) logHandoff("RiskItem", 2, { count: reopened.length });
  return { reopened, unchanged, rows };
}

// 单条确认：写入确认结论
export function confirmRisk(items: RiskItem[], id: number, owner: string, conclusion: string): RiskItem[] {
  if (!owner.trim()) throw toServiceError(HANDOFF_ERROR_CODES.OWNER_REQUIRED);
  const now = new Date().toISOString();
  let found = false;
  const rows = items.map((item) => {
    if (item.id !== id) return item;
    found = true;
    return {
      ...item,
      status: "CONFIRMED",
      confirmed_conclusion: conclusion.trim() || item.confirmed_conclusion,
      confirmed_by: owner.trim(),
      confirmed_at: now,
      previous_summary: null,
      reopened_at: null,
      updated_at: now
    };
  });
  if (!found) throw toServiceError(HANDOFF_ERROR_CODES.RISK_NOT_FOUND);
  logHandoff("RiskItem", 0, { id, owner });
  return rows;
}

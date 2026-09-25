import { HANDOFF_ERROR_MESSAGES } from "../constants/handoffErrorMessages";
import type { HandoffRecord } from "../types/HandoffRecord";
import type { OwnerSummary } from "../types/Owner";
import type { RiskItem } from "../types/RiskItem";
import { UNASSIGNED_OWNER } from "../constants/statusText";
import {
  applyHandoff,
  confirmRisk,
  isOpenRisk,
  reevaluatePolicyVersion,
  type ClauseVersionInput,
  type HandoffInput,
  type HandoffResult,
  type ReopenResult
} from "../services/handoffService";
import { HandoffServiceError } from "../services/handoffErrors";

// controller 层异常：面向页面，message 已本地化，保留内层 service 错误码
export class HandoffControllerError extends Error {
  readonly causeCode: string;
  constructor(serviceError: HandoffServiceError) {
    super(`交接操作失败：${HANDOFF_ERROR_MESSAGES[serviceError.code]}`);
    this.name = "HandoffControllerError";
    this.causeCode = serviceError.code;
  }
}

function wrap<T>(fn: () => T): T {
  try {
    return fn();
  } catch (error) {
    if (error instanceof HandoffServiceError) throw new HandoffControllerError(error);
    throw error;
  }
}

export function submitHandoff(items: RiskItem[], records: HandoffRecord[], input: HandoffInput): HandoffResult {
  return wrap(() => applyHandoff(items, records, input));
}

export function submitPolicyReevaluation(items: RiskItem[], versions: ClauseVersionInput[]): ReopenResult {
  return wrap(() => reevaluatePolicyVersion(items, versions));
}

export function submitConfirm(items: RiskItem[], id: number, owner: string, conclusion: string): RiskItem[] {
  return wrap(() => confirmRisk(items, id, owner, conclusion));
}

/** 负责人视图：剩余待办数、已确认数、最近交接时间；无负责人条目归入未分配 */
export function buildOwnerSummaries(items: RiskItem[], records: HandoffRecord[]): OwnerSummary[] {
  const owners = new Set<string>([UNASSIGNED_OWNER]);
  items.forEach((item) => owners.add(item.assignee ?? UNASSIGNED_OWNER));
  records.forEach((record) => owners.add(record.to_owner));

  // 每个负责人的最近交接时间：作为交出方或接手方的批次都计入
  const lastHandoff = new Map<string, string>();
  records.forEach((record) => {
    [record.from_owner, record.to_owner].forEach((owner) => {
      const current = lastHandoff.get(owner);
      if (!current || record.created_at > current) lastHandoff.set(owner, record.created_at);
    });
  });

  return [...owners].map((owner) => {
    const owned = items.filter((item) => (item.assignee ?? UNASSIGNED_OWNER) === owner);
    return {
      owner,
      open_count: owned.filter(isOpenRisk).length,
      confirmed_count: owned.filter((item) => item.status === "CONFIRMED").length,
      last_handoff_at: lastHandoff.get(owner) ?? null
    };
  }).sort((a, b) => {
    if (a.owner === UNASSIGNED_OWNER) return -1;
    if (b.owner === UNASSIGNED_OWNER) return 1;
    return a.owner.localeCompare(b.owner, "zh-CN");
  });
}

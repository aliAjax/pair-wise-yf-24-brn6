import type { RiskCategory } from "./RiskCategory";
import type { ReviewStatus } from "./ReviewStatus";

/**
 * 交接记录：一次按分类批量指派的完整经过。
 * scope 记录本次批量覆盖的分类集合，risk_ids 记录实际转出的条目。
 * unhandled 为 true 的条目属于「未处理风险随人转走」；
 * 已确认/已解决条目交接时 witness 非空，原结论保留并留下接手见证。
 */
export interface HandoverRecord {
  id: number;
  risk_ids: number[];
  scope: RiskCategory[];
  from_owner_id: number | null;
  to_owner_id: number;
  to_owner_name: string;
  note: string;
  operator: string;
  created_at: string;
  risk_statuses: { risk_id: number; status: ReviewStatus }[];
}

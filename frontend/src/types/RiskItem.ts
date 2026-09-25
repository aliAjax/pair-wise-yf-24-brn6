import type { RiskCategory } from "./RiskCategory";
import type { ReviewStatus } from "./ReviewStatus";
import type { PrivacyRiskLevel } from "./PrivacyRiskLevel";
import type { HandoverWitness } from "./HandoverWitness";

/**
 * 风险条目：隐私政策审阅清单上的一条待办/结论。
 * - owner_id 为空表示历史数据尚未分配负责人（在负责人视图中归入「未分配」）。
 * - confirmed_* 保留最近一次确认结论，条款改版后即使条目回到待处理，结论仍可追溯。
 * - previous_summary 为条款改版前的旧摘要，与 summary 同时展示，构成新旧对照。
 * - latest_witness 是最近一次交接留下的接手见证；完整交接经过见 HandoverRecord。
 */
export interface RiskItem {
  id: number;
  clause_key: string;
  clause_no: string;
  heading: string;
  category: RiskCategory;
  risk_level: PrivacyRiskLevel;
  version_label: string;
  summary: string;
  status: ReviewStatus;
  owner_id: number | null;
  created_at: string;
  updated_at: string;
  reopened_at: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  confirmed_comment: string | null;
  previous_summary: string | null;
  latest_witness: HandoverWitness | null;
}

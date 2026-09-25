import type { RiskCategory } from "./RiskCategory";

/**
 * 政策新版改动：发布新版时登记的单条条款变化。
 * summary 为新版摘要；RiskItem 上的 previous_summary 取自旧版摘要，用于新旧对照。
 */
export interface PolicyVersionChange {
  clause_key: string;
  clause_no: string;
  heading: string;
  category: RiskCategory;
  old_summary: string;
  new_summary: string;
}

export interface PolicyVersion {
  id: number;
  version_label: string;
  released_at: string;
  changes: PolicyVersionChange[];
}

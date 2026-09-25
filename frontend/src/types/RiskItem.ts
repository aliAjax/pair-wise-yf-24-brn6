import type { PolicyCategory } from "./PolicyCategory";

// 风险条目（审阅清单的待办实体）：按条款分类指派负责人，随交接流转
export interface RiskItem {
  id: number;
  clause_no: string;                 // 条款编号，跨版本对应同一条款
  clause_key: string;                // 跨版本匹配键（category + clause_no）
  title: string;                     // 条款标题
  category: PolicyCategory;          // 数据收集 / 共享 / 保存期限
  risk_level: string;                // PrivacyRiskLevel
  status: string;                    // ReviewStatus
  document_id: number;               // 条目所确认/针对的政策文档版本
  summary: string;                   // 当前版本摘要（新版内容）
  previous_summary: string | null;   // 旧版摘要：条款改过后重新回到待处理时展示
  reopened_at: string | null;        // 内容改动、结论失效、重新打开的时间
  assignee: string;                  // 当前负责人，空串表示未分配
  /** 已确认条目保留的原结论 */
  confirmed_conclusion: string | null;
  confirmed_by: string | null;       // 原确认人
  confirmed_at: string | null;       // 原确认时间
  /** 交接见证：已确认条目交接后由接手人留痕，结论本身不变 */
  witness: RiskWitness | null;
  created_at: string;
  updated_at: string;
}

export interface RiskWitness {
  owner: string;                     // 见证/接手人
  handoff_id: number;                // 对应交接批次
  note: string;                      // 交接说明
  handed_at: string;
}

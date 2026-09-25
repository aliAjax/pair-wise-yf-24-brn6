// 负责人视图汇总行
export interface OwnerSummary {
  owner: string;                     // 空串表示未分配
  open_count: number;                // 剩余待办
  confirmed_count: number;
  last_handoff_at: string | null;    // 最近交接时间
}

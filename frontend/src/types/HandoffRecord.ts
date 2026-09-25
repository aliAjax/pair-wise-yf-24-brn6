import type { PolicyCategory } from "./PolicyCategory";

// 交接批次：按分类批量指派接手人
export interface HandoffRecord {
  id: number;
  category: PolicyCategory;
  from_owner: string;                // 交出方，空串表示从未分配（未分配池）
  to_owner: string;                  // 接手人
  note: string;                      // 交接说明
  moved_open_count: number;          // 随人转走的未处理条目数
  witnessed_count: number;           // 已确认条目留下接手见证的条数
  created_at: string;
}

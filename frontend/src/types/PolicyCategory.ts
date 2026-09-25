// 审阅分类：数据收集 / 共享 / 保存期限（批量交接的最小单位）
export const PolicyCategory = ["DATA_COLLECTION", "SHARING", "RETENTION"] as const;
export type PolicyCategory = (typeof PolicyCategory)[number];

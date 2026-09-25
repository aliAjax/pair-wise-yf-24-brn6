export const PolicyCategory = ["DATA_COLLECTION", "SHARING", "RETENTION"] as const;
export type PolicyCategory = (typeof PolicyCategory)[number];
export const PolicyCategoryText: Record<PolicyCategory, string> = {
  DATA_COLLECTION: "数据收集",
  SHARING: "共享",
  RETENTION: "保存期限"
};

export const RiskCategory = ["COLLECTION", "SHARING", "RETENTION"] as const;
export type RiskCategory = (typeof RiskCategory)[number];

export const RiskCategoryText: Record<RiskCategory, string> = {
  COLLECTION: "数据收集",
  SHARING: "数据共享",
  RETENTION: "保存期限"
};

/** 交接台批量指派时的分类筛选顺序。 */
export const RiskCategoryOrder: RiskCategory[] = ["COLLECTION", "SHARING", "RETENTION"];

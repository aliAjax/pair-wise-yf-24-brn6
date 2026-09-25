export const RiskCategory = ["COLLECTION", "SHARING", "RETENTION"] as const;
export type RiskCategory = (typeof RiskCategory)[number];

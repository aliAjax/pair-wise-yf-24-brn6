export const ReviewStatus = ["OPEN","CONFIRMED","IGNORED","RESOLVED"] as const;
export type ReviewStatus = (typeof ReviewStatus)[number];
export const ReviewStatusText: Record<ReviewStatus, string> = {
  OPEN: "待处理",
  CONFIRMED: "已确认",
  IGNORED: "已忽略",
  RESOLVED: "已解决"
};

/** 交接语义下的状态分组：未处理风险条目随人转走，其余条目保留结论并留见证。 */
export const UnhandledReviewStatuses: ReviewStatus[] = ["OPEN"];
export const ConcludedReviewStatuses: ReviewStatus[] = ["CONFIRMED", "IGNORED", "RESOLVED"];

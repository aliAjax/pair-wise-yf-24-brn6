import type { RiskItem } from "../types/RiskItem";

/** 政策改版后回到待处理的条目：需要新旧摘要对照展示。 */
export function isReopenedItem(item: RiskItem): boolean {
  return item.status === "OPEN" && item.reopened_at !== null && item.previous_summary !== null;
}

export function useReopenDiff() {
  return { isReopenedItem };
}

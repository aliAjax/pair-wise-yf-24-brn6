import type { RiskItem } from "../types/RiskItem";
import { loadCollection, persistCollection, writeLog } from "./_storage";
import { LOG_TEMPLATES } from "../constants/logTemplates";

const endpoint = "/api/risk-item";
const storageKey = "riskItem";

export async function listRiskItem(): Promise<RiskItem[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return loadCollection<RiskItem>(storageKey);
}

export async function saveRiskItems(rows: RiskItem[]): Promise<RiskItem[]> {
  writeLog(LOG_TEMPLATES.RiskItem[1], { count: rows.length });
  return persistCollection<RiskItem>(storageKey, rows);
}

import { mockData } from "../mocks/seedData";
import type { RiskItem } from "../types/RiskItem";
import { readTable, storageKeys, writeTable } from "../utils/localTable";

const endpoint = "/api/risk-item";

export async function listRiskItem(): Promise<RiskItem[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return readTable(storageKeys.riskItem, mockData.riskItem as unknown as RiskItem[]);
}

export async function saveRiskItems(rows: RiskItem[]): Promise<RiskItem[]> {
  console.info("save RiskItem batch", rows.length);
  writeTable(storageKeys.riskItem, rows);
  return rows;
}

export async function saveRiskItem(payload: RiskItem): Promise<RiskItem> {
  console.info("save RiskItem", payload);
  const rows = await listRiskItem();
  const index = rows.findIndex((row) => row.id === payload.id);
  if (index >= 0) rows[index] = payload;
  else rows.push(payload);
  await saveRiskItems(rows);
  return payload;
}

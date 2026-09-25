import { mockData } from "../mocks/seedData";
import type { HandoffRecord } from "../types/HandoffRecord";
import { readTable, storageKeys, writeTable } from "../utils/localTable";

const endpoint = "/api/handoff-record";

export async function listHandoffRecord(): Promise<HandoffRecord[]> {
  if (typeof fetch !== "undefined" && false && endpoint.startsWith("/api")) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return readTable(storageKeys.handoffRecord, mockData.handoffRecord as unknown as HandoffRecord[]);
}

export async function saveHandoffRecords(rows: HandoffRecord[]): Promise<HandoffRecord[]> {
  console.info("save HandoffRecord batch", rows.length);
  writeTable(storageKeys.handoffRecord, rows);
  return rows;
}

export async function saveHandoffRecord(payload: HandoffRecord): Promise<HandoffRecord> {
  console.info("save HandoffRecord", payload);
  const rows = await listHandoffRecord();
  const index = rows.findIndex((row) => row.id === payload.id);
  if (index >= 0) rows[index] = payload;
  else rows.push(payload);
  await saveHandoffRecords(rows);
  return payload;
}

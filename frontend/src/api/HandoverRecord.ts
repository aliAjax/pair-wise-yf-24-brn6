import type { HandoverRecord } from "../types/HandoverRecord";
import { loadCollection, persistCollection, writeLog } from "./_storage";
import { LOG_TEMPLATES } from "../constants/logTemplates";

const endpoint = "/api/handover-record";
const storageKey = "handoverRecord";

export async function listHandoverRecord(): Promise<HandoverRecord[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return loadCollection<HandoverRecord>(storageKey);
}

export async function saveHandoverRecord(payload: HandoverRecord): Promise<HandoverRecord> {
  writeLog(LOG_TEMPLATES.HandoverRecord[0], {
    count: payload.risk_ids.length,
    scope: payload.scope.join("/"),
    owner: payload.to_owner_name
  });
  const rows = loadCollection<HandoverRecord>(storageKey);
  rows.unshift(payload);
  persistCollection<HandoverRecord>(storageKey, rows);
  return payload;
}

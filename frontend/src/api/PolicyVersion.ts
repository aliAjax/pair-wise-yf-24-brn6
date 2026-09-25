import type { PolicyVersion, PolicyVersionChange } from "../types/PolicyVersion";
import { mockData } from "../mocks/seedData";
import { loadCollection, persistCollection, writeLog } from "./_storage";
import { LOG_TEMPLATES } from "../constants/logTemplates";

const endpoint = "/api/policy-version";
const storageKey = "policyVersion";

export async function listPolicyVersion(): Promise<PolicyVersion[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return loadCollection<PolicyVersion>(storageKey);
}

export async function savePolicyVersion(payload: PolicyVersion): Promise<PolicyVersion> {
  writeLog(LOG_TEMPLATES.PolicyVersion[0], {
    version: payload.version_label,
    count: payload.changes.length
  });
  const rows = loadCollection<PolicyVersion>(storageKey);
  rows.unshift(payload);
  persistCollection<PolicyVersion>(storageKey, rows);
  return payload;
}

/** 下一版草稿：模拟编辑好的政策新版，发布后才会重置已确认结论。 */
export function listDraftVersionChanges(): readonly PolicyVersionChange[] {
  return mockData.draftVersionChange;
}

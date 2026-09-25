import type { Owner } from "../types/Owner";
import { loadCollection } from "./_storage";

const endpoint = "/api/owner";
const storageKey = "owner";

export async function listOwner(): Promise<Owner[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return loadCollection<Owner>(storageKey);
}

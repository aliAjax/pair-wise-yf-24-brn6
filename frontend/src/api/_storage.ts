import { mockData } from "../mocks/seedData";

/**
 * 交接台本地持久化：所有写操作落到 localStorage，首次访问时从种子数据迁移。
 * 旧版本（policy-diff 初始快照）没有 owner/riskItem/handoverRecord/policyVersion
 * 键，读取时自动补齐，因此历史风险条目的 owner_id 会以 null 形态进入「未分配」。
 */
const PREFIX = "policy-diff:";

type SeedKey = keyof typeof mockData;

function readSeed<T>(key: SeedKey): T[] {
  return [...(mockData[key] as unknown as T[])];
}

export function loadCollection<T>(key: string): T[] {
  if (typeof localStorage === "undefined") return readSeed<T>(key as SeedKey);
  const storageKey = PREFIX + key;
  const raw = localStorage.getItem(storageKey);
  if (raw === null) {
    const seeded = readSeed<T>(key as SeedKey);
    localStorage.setItem(storageKey, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as T[];
  } catch {
    // 本地缓存损坏时回退种子数据，避免交接台整体不可用。
    return readSeed<T>(key as SeedKey);
  }
}

export function persistCollection<T>(key: string, rows: T[]): T[] {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(PREFIX + key, JSON.stringify(rows));
  }
  return rows;
}

export function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}

export function writeLog(template: string, detail: Record<string, string | number> = {}): void {
  const message = template.replace(/\{(\w+)\}/g, (_, name: string) => String(detail[name] ?? ""));
  if (typeof console !== "undefined") console.info("[handover]", message, detail);
}

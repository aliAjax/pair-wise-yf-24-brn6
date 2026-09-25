// 本地存储封装：首次访问以 mock 种子初始化，之后所有写操作持久化到 localStorage
const PREFIX = "policy-diff:";

export function readTable<T>(key: string, seed: readonly T[]): T[] {
  if (typeof localStorage === "undefined") return [...seed];
  const storageKey = PREFIX + key;
  const raw = localStorage.getItem(storageKey);
  if (raw === null) {
    localStorage.setItem(storageKey, JSON.stringify(seed));
    return [...seed];
  }
  try {
    return JSON.parse(raw) as T[];
  } catch {
    // 解析失败时回退种子，避免脏数据阻断审阅
    return [...seed];
  }
}

export function writeTable<T>(key: string, rows: T[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(PREFIX + key, JSON.stringify(rows));
}

export const storageKeys = {
  riskItem: "riskItem",
  handoffRecord: "handoffRecord"
} as const;

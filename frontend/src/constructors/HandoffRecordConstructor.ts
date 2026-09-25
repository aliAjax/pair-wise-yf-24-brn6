import type { HandoffRecord } from "../types/HandoffRecord";

export const createDefaultHandoffRecord = (overrides: Partial<HandoffRecord> = {}): HandoffRecord => ({
  id: 0,
  category: "DATA_COLLECTION",
  from_owner: "",
  to_owner: "",
  note: "",
  moved_open_count: 0,
  witnessed_count: 0,
  created_at: new Date(0).toISOString(),
  ...overrides
});

// 交接表单对象：页面填写后由 service 落库为 HandoffRecord
export const createHandoffForm = (
  overrides: Partial<Omit<HandoffRecord, "id" | "moved_open_count" | "witnessed_count" | "created_at">> = {}
): Omit<HandoffRecord, "id"> => ({
  category: "DATA_COLLECTION",
  from_owner: "",
  to_owner: "",
  note: "",
  moved_open_count: 0,
  witnessed_count: 0,
  created_at: new Date().toISOString(),
  ...overrides
});

export const createHandoffResponse = createDefaultHandoffRecord;

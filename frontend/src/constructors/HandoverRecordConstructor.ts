import type { HandoverRecord } from "../types/HandoverRecord";

export const createDefaultHandoverRecord = (overrides: Partial<HandoverRecord> = {}): HandoverRecord => ({
  id: 0,
  risk_ids: [],
  scope: [],
  from_owner_id: null,
  to_owner_id: 0,
  to_owner_name: "",
  note: "",
  operator: "",
  created_at: new Date(0).toISOString(),
  risk_statuses: [],
  ...overrides
});

/** 批量交接表单：与提交 DTO 对齐，页面/store 不散写结构。 */
export const createHandoverForm = (overrides: Partial<HandoverRecord> = {}): HandoverRecord =>
  createDefaultHandoverRecord(overrides);

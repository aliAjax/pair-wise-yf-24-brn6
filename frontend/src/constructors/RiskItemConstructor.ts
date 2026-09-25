import type { RiskItem, RiskWitness } from "../types/RiskItem";

export const createDefaultRiskWitness = (overrides: Partial<RiskWitness> = {}): RiskWitness => ({
  owner: "接手人",
  handoff_id: 0,
  note: "",
  handed_at: new Date(0).toISOString(),
  ...overrides
});

export const createDefaultRiskItem = (overrides: Partial<RiskItem> = {}): RiskItem => ({
  id: 0,
  clause_no: "",
  clause_key: "",
  title: "",
  category: "DATA_COLLECTION",
  risk_level: "MEDIUM",
  status: "OPEN",
  document_id: 0,
  summary: "",
  previous_summary: null,
  reopened_at: null,
  assignee: "",
  confirmed_conclusion: null,
  confirmed_by: null,
  confirmed_at: null,
  witness: null,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
  ...overrides
});

export const createRiskItemForm = createDefaultRiskItem;
export const createRiskItemResponse = createDefaultRiskItem;

import type { RiskItem } from "../types/RiskItem";
import type { HandoverWitness } from "../types/HandoverWitness";

export const createDefaultRiskItem = (overrides: Partial<RiskItem> = {}): RiskItem => ({
  id: 0,
  clause_key: "",
  clause_no: "",
  heading: "",
  category: "COLLECTION",
  risk_level: "LOW",
  version_label: "v1.0",
  summary: "",
  status: "OPEN",
  owner_id: null,
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
  reopened_at: null,
  confirmed_by: null,
  confirmed_at: null,
  confirmed_comment: null,
  previous_summary: null,
  latest_witness: null,
  ...overrides
});

export const createRiskItemForm = createDefaultRiskItem;
export const createRiskItemResponse = createDefaultRiskItem;

export const createDefaultHandoverWitness = (overrides: Partial<HandoverWitness> = {}): HandoverWitness => ({
  record_id: 0,
  from_owner_id: null,
  to_owner_id: 0,
  to_owner_name: "",
  note: "",
  handed_over_at: new Date(0).toISOString(),
  ...overrides
});

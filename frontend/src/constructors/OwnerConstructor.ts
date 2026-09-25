import type { Owner } from "../types/Owner";
import type { PolicyVersion } from "../types/PolicyVersion";

export const createDefaultOwner = (overrides: Partial<Owner> = {}): Owner => ({
  id: 0,
  name: "",
  team: "",
  active: true,
  ...overrides
});

export const createDefaultPolicyVersion = (overrides: Partial<PolicyVersion> = {}): PolicyVersion => ({
  id: 0,
  version_label: "",
  released_at: new Date(0).toISOString(),
  changes: [],
  ...overrides
});

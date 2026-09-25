import { HANDOFF_LOG_TEMPLATES } from "../constants/handoffLogTemplates";

// service 层日志：交接相关写操作统一经此留痕
export function logHandoff(scope: keyof typeof HANDOFF_LOG_TEMPLATES, index: number, detail: Record<string, unknown>): void {
  const templates = HANDOFF_LOG_TEMPLATES[scope];
  const template = templates[index] ?? templates[0];
  console.info(`[handoff-service] ${template}`, detail);
}

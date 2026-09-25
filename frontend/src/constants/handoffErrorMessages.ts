export const HANDOFF_ERROR_MESSAGES = {
  OWNER_REQUIRED: "请选择当前负责人",
  HANDOFF_TARGET_REQUIRED: "请填写接手人后再提交交接",
  CATEGORY_REQUIRED: "请选择至少一个交接分类（数据收集 / 共享 / 保存期限）",
  NO_OPEN_RISK_TO_HANDOFF: "该分类下没有可随人转走的未处理风险条目",
  RISK_NOT_FOUND: "未找到对应的风险条目，可能已被其他同事处理"
} as const;

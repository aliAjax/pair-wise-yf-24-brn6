export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  HANDOVER_EMPTY_SELECTION: "请先勾选需要交接的风险条目，或调整分类/负责人筛选范围",
  HANDOVER_OWNER_REQUIRED: "请选择接手人后再提交批量交接",
  HANDOVER_NOTE_REQUIRED: "交接说明为必填项，请填写后再转交手尾事项",
  VERSION_NO_CHANGES: "该政策新版没有登记任何条款变化，无法触发结论重置",
  RISK_ITEM_NOT_FOUND: "未找到对应的风险条目，可能已被其他同事处理"
};

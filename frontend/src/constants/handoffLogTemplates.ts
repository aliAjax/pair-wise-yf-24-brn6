// 交接相关操作日志模板，与 LOG_TEMPLATES 分开维护，新增写操作必须在此登记
export const HANDOFF_LOG_TEMPLATES = {
  RiskItem: [
    "风险条目创建",
    "风险条目随交接转派接手人",
    "政策新版条款改动，已确认条目退回待处理",
    "风险条目确认结论导出"
  ],
  HandoffRecord: [
    "交接批次创建",
    "交接批次更新",
    "交接批次见证留痕",
    "交接记录导出"
  ]
};

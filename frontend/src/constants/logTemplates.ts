export const LOG_TEMPLATES = {
  PolicyDocument: ["政策文档创建", "政策文档更新", "政策文档状态变更", "政策文档导出"],
  PolicySection: ["条款段落创建", "条款段落更新", "条款段落状态变更", "条款段落导出"],
  DiffResult: ["差异结果创建", "差异结果更新", "差异结果状态变更", "差异结果导出"],
  ReviewNote: ["审阅备注创建", "审阅备注更新", "审阅备注状态变更", "审阅备注导出"],
  RiskItem: [
    "风险条目创建",
    "风险条目集合批量保存（共 {count} 条）",
    "风险条目因条款改版回到待处理（{clause_no}：{version}）",
    "风险条目确认结论更新（{clause_no} {status}）"
  ],
  HandoverRecord: [
    "交接记录创建（{count} 条，分类：{scope}，接手人：{owner}）",
    "交接记录补填说明（记录 #{id}）",
    "接手见证确认（{clause_no}：{from} → {to}）",
    "交接记录导出（共 {count} 条）"
  ],
  Owner: ["负责人创建", "负责人信息更新", "负责人停用", "负责人视图汇总"],
  PolicyVersion: [
    "政策新版登记（{version}，{count} 处条款变化）",
    "政策新版发布并重置已确认结论",
    "条款新旧摘要生成（{clause_no}）",
    "政策版本导出"
  ]
};

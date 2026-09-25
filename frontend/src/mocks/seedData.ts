import type { RiskCategory } from "../types/RiskCategory";

/** 旧记录没有负责人时 owner_id 为 null，在负责人视图中归入「未分配」。 */
export const mockData = {
  "owner": [
    { "id": 1, "name": "林若琳", "team": "法务合规组", "active": true },
    { "id": 2, "name": "周启航", "team": "数据安全组", "active": true },
    { "id": 3, "name": "许佩珊", "team": "产品法务组", "active": true },
    { "id": 4, "name": "高志明", "team": "外部顾问", "active": false }
  ],
  "riskItem": [
    {
      "id": 1,
      "clause_key": "C-01",
      "clause_no": "3.1",
      "heading": "我们收集的个人信息",
      "category": "COLLECTION",
      "risk_level": "HIGH",
      "version_label": "v3.3",
      "summary": "注册时收集手机号、设备标识与粗略位置，位置用途未单独说明。",
      "status": "OPEN",
      "owner_id": null,
      "created_at": "2026-06-18T03:00:00Z",
      "updated_at": "2026-09-10T02:20:00Z",
      "reopened_at": null,
      "confirmed_by": null,
      "confirmed_at": null,
      "confirmed_comment": null,
      "previous_summary": null,
      "latest_witness": null
    },
    {
      "id": 2,
      "clause_key": "C-02",
      "clause_no": "3.2",
      "heading": "敏感个人信息的收集",
      "category": "COLLECTION",
      "risk_level": "MEDIUM",
      "version_label": "v3.3",
      "summary": "实名认证时收集身份证号，已说明单独同意与加密存储。",
      "status": "OPEN",
      "owner_id": 1,
      "created_at": "2026-07-02T06:30:00Z",
      "updated_at": "2026-08-20T08:10:00Z",
      "reopened_at": null,
      "confirmed_by": null,
      "confirmed_at": null,
      "confirmed_comment": null,
      "previous_summary": null,
      "latest_witness": null
    },
    {
      "id": 3,
      "clause_key": "S-01",
      "clause_no": "5.1",
      "heading": "向第三方共享信息",
      "category": "SHARING",
      "risk_level": "CRITICAL",
      "version_label": "v3.3",
      "summary": "向广告合作方共享设备标识与行为标签，合作方清单季度更新。",
      "status": "CONFIRMED",
      "owner_id": 2,
      "created_at": "2026-06-20T07:00:00Z",
      "updated_at": "2026-08-01T09:30:00Z",
      "reopened_at": null,
      "confirmed_by": "周启航",
      "confirmed_at": "2026-08-01T09:30:00Z",
      "confirmed_comment": "合作方已签 DPA，要求年度审计；结论：风险可接受，保持季度复核。",
      "previous_summary": null,
      "latest_witness": {
        "record_id": 1,
        "from_owner_id": 1,
        "to_owner_id": 2,
        "to_owner_name": "周启航",
        "note": "广告合作方 DPA 与年度审计安排已确认，按原结论继续跟进。",
        "handed_over_at": "2026-08-01T09:30:00Z"
      }
    },
    {
      "id": 4,
      "clause_key": "S-02",
      "clause_no": "5.3",
      "heading": "关联公司间的数据转移",
      "category": "SHARING",
      "risk_level": "HIGH",
      "version_label": "v3.3",
      "summary": "向关联公司转移账号数据用于统一登录，已列出接收方主体。",
      "status": "CONFIRMED",
      "owner_id": 3,
      "created_at": "2026-06-25T03:30:00Z",
      "updated_at": "2026-09-02T06:40:00Z",
      "reopened_at": null,
      "confirmed_by": "林若琳",
      "confirmed_at": "2026-07-15T08:00:00Z",
      "confirmed_comment": "接收方清单与跨境评估齐备，统一登录场景必要，确认无异议。",
      "previous_summary": null,
      "latest_witness": {
        "record_id": 2,
        "from_owner_id": null,
        "to_owner_id": 3,
        "to_owner_name": "许佩珊",
        "note": "历史条目补登记到许佩珊名下，已核对跨境评估结论继续有效。",
        "handed_over_at": "2026-09-02T06:40:00Z"
      }
    },
    {
      "id": 5,
      "clause_key": "R-01",
      "clause_no": "7.1",
      "heading": "信息保存期限",
      "category": "RETENTION",
      "risk_level": "MEDIUM",
      "version_label": "v3.3",
      "summary": "账号数据保存至注销后 30 天，日志保存 6 个月，到期删除。",
      "status": "OPEN",
      "owner_id": 2,
      "created_at": "2026-07-08T09:15:00Z",
      "updated_at": "2026-08-28T02:00:00Z",
      "reopened_at": null,
      "confirmed_by": null,
      "confirmed_at": null,
      "confirmed_comment": null,
      "previous_summary": null,
      "latest_witness": null
    },
    {
      "id": 6,
      "clause_key": "R-02",
      "clause_no": "7.2",
      "heading": "超期数据的匿名化处理",
      "category": "RETENTION",
      "risk_level": "LOW",
      "version_label": "v3.3",
      "summary": "超期订单数据脱敏后用于经营分析，匿名化标准引用内部白皮书。",
      "status": "OPEN",
      "owner_id": 1,
      "created_at": "2026-07-10T01:00:00Z",
      "updated_at": "2026-09-10T02:20:00Z",
      "reopened_at": "2026-09-10T02:20:00Z",
      "confirmed_by": "林若琳",
      "confirmed_at": "2026-08-05T07:30:00Z",
      "confirmed_comment": "匿名化白皮书已评审，K 匿名度满足内部红线，原已确认。",
      "previous_summary": "超期订单数据删除，不用于经营分析。",
      "latest_witness": null
    },
    {
      "id": 7,
      "clause_key": "C-03",
      "clause_no": "3.4",
      "heading": "Cookie 与同类技术",
      "category": "COLLECTION",
      "risk_level": "LOW",
      "version_label": "v3.2",
      "summary": "使用必要 Cookie 维持登录态，第三方分析 Cookie 默认关闭。",
      "status": "RESOLVED",
      "owner_id": null,
      "created_at": "2026-06-12T08:00:00Z",
      "updated_at": "2026-07-30T03:00:00Z",
      "reopened_at": null,
      "confirmed_by": "林若琳",
      "confirmed_at": "2026-07-30T03:00:00Z",
      "confirmed_comment": "已补充 Cookie 开关与拒绝路径，问题关闭。",
      "previous_summary": null,
      "latest_witness": null
    },
    {
      "id": 8,
      "clause_key": "S-03",
      "clause_no": "5.4",
      "heading": "依法共享的例外情形",
      "category": "SHARING",
      "risk_level": "MEDIUM",
      "version_label": "v3.2",
      "summary": "应监管要求共享时将记录请求台账，最小必要范围待补充。",
      "status": "OPEN",
      "owner_id": null,
      "created_at": "2026-06-15T05:45:00Z",
      "updated_at": "2026-06-15T05:45:00Z",
      "reopened_at": null,
      "confirmed_by": null,
      "confirmed_at": null,
      "confirmed_comment": null,
      "previous_summary": null,
      "latest_witness": null
    }
  ],
  "handoverRecord": [
    {
      "id": 1,
      "risk_ids": [3],
      "scope": ["SHARING"],
      "from_owner_id": 1,
      "to_owner_id": 2,
      "to_owner_name": "周启航",
      "note": "广告共享专项转给数据安全组，DPA 审计节点在 11 月，接手时请核对合作方清单。",
      "operator": "林若琳",
      "created_at": "2026-08-01T09:30:00Z",
      "risk_statuses": [{ "risk_id": 3, "status": "CONFIRMED" }]
    },
    {
      "id": 2,
      "risk_ids": [4],
      "scope": ["SHARING"],
      "from_owner_id": null,
      "to_owner_id": 3,
      "to_owner_name": "许佩珊",
      "note": "历史条目补负责人，统一登录的跨境评估材料已归档到合规库 G-2026-018。",
      "operator": "林若琳",
      "created_at": "2026-09-02T06:40:00Z",
      "risk_statuses": [{ "risk_id": 4, "status": "CONFIRMED" }]
    }
  ],
  "policyVersion": [
    {
      "id": 1,
      "version_label": "v3.2",
      "released_at": "2026-06-10T02:00:00Z",
      "changes": []
    },
    {
      "id": 2,
      "version_label": "v3.3",
      "released_at": "2026-09-10T02:20:00Z",
      "changes": [
        {
          "clause_key": "R-02",
          "clause_no": "7.2",
          "heading": "超期数据的匿名化处理",
          "category": "RETENTION",
          "old_summary": "超期订单数据删除，不用于经营分析。",
          "new_summary": "超期订单数据脱敏后用于经营分析，匿名化标准引用内部白皮书。"
        }
      ]
    }
  ],
  /** 初始快照遗留实体：保留种子以兼容对比/文档/审阅模块。 */
  "policyDocument": [
    {
      "id": 1,
      "title": "隐私政策",
      "version_label": "v3.2",
      "raw_text": "raw text 1",
      "normalized_sections": "normalized sections 1",
      "imported_at": "2026-06-10T02:00:00Z"
    },
    {
      "id": 2,
      "title": "隐私政策",
      "version_label": "v3.3",
      "raw_text": "raw text 2",
      "normalized_sections": "normalized sections 2",
      "imported_at": "2026-09-10T02:20:00Z"
    }
  ],
  "policySection": [
    {
      "id": 1,
      "document_id": 1,
      "section_no": "3.1",
      "heading": "我们收集的个人信息",
      "content": "content 1",
      "category": "COLLECTION",
      "risk_level": "HIGH"
    },
    {
      "id": 2,
      "document_id": 2,
      "section_no": "5.1",
      "heading": "向第三方共享信息",
      "content": "content 2",
      "category": "SHARING",
      "risk_level": "CRITICAL"
    }
  ],
  "diffResult": [
    {
      "id": 1,
      "old_document_id": 1,
      "new_document_id": 2,
      "section_id": 1,
      "diff_type": "MODIFIED",
      "summary": "注册信息收集范围调整",
      "created_at": "2026-09-10T02:20:00Z"
    }
  ],
  "reviewNote": [
    {
      "id": 1,
      "diff_result_id": 1,
      "tag": "待补充用途说明",
      "comment": "位置信息用途需单独列明",
      "reviewer": "林若琳",
      "status": "OPEN"
    }
  ],
  /** 下一版草稿：用于「发布新版」演示，发布后匹配条款的已确认结论回到待处理。 */
  "draftVersionChange": [
    {
      "clause_key": "C-02",
      "clause_no": "3.2",
      "heading": "敏感个人信息的收集",
      "category": "COLLECTION" as RiskCategory,
      "old_summary": "实名认证时收集身份证号，已说明单独同意与加密存储。",
      "new_summary": "新增收集人脸信息用于实人核验，将与第三方核验服务商共享人脸模板。"
    },
    {
      "clause_key": "S-01",
      "clause_no": "5.1",
      "heading": "向第三方共享信息",
      "category": "SHARING" as RiskCategory,
      "old_summary": "向广告合作方共享设备标识与行为标签，合作方清单季度更新。",
      "new_summary": "共享范围扩大至位置信息与通讯录标签，合作方改为月度更新且新增跨境接收方。"
    },
    {
      "clause_key": "C-04",
      "clause_no": "3.5",
      "heading": "语音信息的收集",
      "category": "COLLECTION" as RiskCategory,
      "old_summary": "",
      "new_summary": "新增智能客服语音录音收集，保存期限与转写用途尚未说明。"
    }
  ]
} as const;

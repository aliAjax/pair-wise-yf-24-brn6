# 隐私政策差异对比器

纯前端隐私政策版本对比与风险标注工具，用户粘贴两版文本后查看条款差异、风险标签和审阅清单，数据存 localStorage。内置「交接台」：按数据收集 / 共享 / 保存期限分类批量交接负责人，未处理风险随人转走，已确认条目保留原结论并留接手见证；政策新版条款改动时原确认自动退回待处理并展示新旧摘要。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20112>



## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`



## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + TypeScript + Vite + Element Plus + Pinia + localStorage |
| 后端 | - |
| 数据库 | 本地模拟数据 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks, services, controllers
```

交接台相关分层（刻意保持与既有实体一致的拆散结构）：

- 类型：`types/PolicyCategory.ts`、`types/RiskItem.ts`、`types/HandoffRecord.ts`、`types/Owner.ts`
- 常量：`constants/PolicyCategory.ts`、`constants/handoffLogTemplates.ts`、`constants/handoffErrorCodes.ts`、`constants/handoffErrorMessages.ts`
- 构造器：`constructors/RiskItemConstructor.ts`、`constructors/HandoffRecordConstructor.ts`
- API / 持久化：`api/RiskItem.ts`、`api/HandoffRecord.ts`、`utils/localTable.ts`（localStorage 读写，首次以 mocks 种子初始化）
- 业务：`services/handoffService.ts`（批量交接、新版退回、确认）、`services/handoffErrors.ts`、`services/handoffLogger.ts`
- 控制器：`controllers/handoffController.ts`（包装 service 异常、汇总负责人视图）
- 状态：`stores/HandoffStore.ts`
- 组件：`components/common/HandoffPanel.vue`、`OwnerBoard.vue`、`HandoffHistory.vue`、`RiskItemCard.vue`
- 页面：`pages/HandoffPage.vue`（路由 `/handoff`，默认首页）

### 交接台业务规则

1. **按分类批量指派**：勾选数据收集 / 共享 / 保存期限，选择交出负责人（含「未分配」池）与接手人、填写交接说明，逐类生成交接批次。
2. **未处理风险随人转走**：OPEN / IGNORED 条目 assignee 改为接手人；交出方下无任何匹配条目时报错。
3. **已确认条目保留原结论 + 接手见证**：CONFIRMED 条目状态、结论、确认人不变，仅追加 witness（见证人、交接说明、批次、时间）。
4. **新版条款改动退回**：按 `clause_key` 匹配同一条款，摘要变化时 CONFIRMED → OPEN，`previous_summary` 存旧摘要、`summary` 存新摘要，原确认结论保留可查；内容未变则结论维持。
5. **负责人视图**：汇总每人剩余待办、已确认数、最近交接时间；`assignee` 为空的旧记录归入「未分配」。

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `policy-diff`
- `FRONTEND_PORT`: 前端端口，默认 `20112`


## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: policy-diff`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-policy-diff}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DiffType: constants/DiffType、types/DiffType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PrivacyRiskLevel: constants/PrivacyRiskLevel、types/PrivacyRiskLevel、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- ReviewStatus: constants/ReviewStatus、types/ReviewStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PolicyCategory（数据收集 DATA_COLLECTION / 共享 SHARING / 保存期限 RETENTION）: constants/PolicyCategory、types/PolicyCategory、constants/statusText、constructors（RiskItem/HandoffRecord 默认值）、services/handoffService（批量交接与退回匹配）、controllers/handoffController（负责人视图）、stores/HandoffStore（分类 getter）、components/common/HandoffPanel（多选）、HandoffHistory、RiskItemCard（文案）、pages/HandoffPage（分类页签与计数）均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT

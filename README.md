# 隐私政策差异对比器

纯前端隐私政策版本对比与风险标注工具，用户粘贴两版文本后查看条款差异、风险标签和审阅清单，数据存 localStorage。内置**交接台**：按数据收集 / 数据共享 / 保存期限分类批量指派接手人，未处理风险随人转走，已确认条目保留原结论并留下接手见证；政策新版改过时原确认结论自动回到待处理并展示新旧摘要；负责人视图汇总剩余待办与最近交接时间，旧记录无负责人时归入「未分配」。

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
frontend/src/api, stores, services, types, constants, constructors,
components/common, hooks, pages, router, utils, mocks
```

## 交接台（handover desk）

三个路由页面（左侧导航「交接台」分组）：

| 页面 | 路由 | 说明 |
|---|---|---|
| 交接台 | `/handovers` | 按分类（数据收集/共享/保存期限）+ 原负责人筛选，勾选条目、选择接手人、填写交接说明后批量指派；展示最近交接 |
| 负责人视图 | `/owners` | 汇总每位负责人剩余待办（按分类拆分）与最近交接时间；旧记录没有负责人时归入「未分配」卡片 |
| 政策新版 | `/versions` | 发布下一版草稿，同一条款内容改过时已确认结论回到待处理，页面展示新旧摘要对照与原确认备注 |

交接规则（见 `services/handoverService.ts`）：

- **未处理条目**（ReviewStatus = OPEN）：负责人随交接转走，状态与结论字段不变。
- **已确认/已忽略/已解决条目**：负责人转走，`confirmed_by/confirmed_at/confirmed_comment` 原结论保留，并在 `latest_witness` 留下接手人、时间与见证说明（同时写入 HandoverRecord）。
- **政策新版发布**：按 `clause_key` 匹配条款，内容确有变化时结论回到 OPEN，记录 `reopened_at` 与 `previous_summary`；新增条款以未分配待办进入清单。
- 所有写操作持久化到 `localStorage`（键前缀 `policy-diff:`），首次访问从 `mocks/seedData.ts` 迁移种子数据。

新增核心模型：`RiskItem`（风险条目）、`Owner`（负责人）、`HandoverRecord`（交接记录）、`HandoverWitness`（接手见证）、`PolicyVersion/PolicyVersionChange`（政策新版与条款改动）。

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
- PrivacyRiskLevel: constants/PrivacyRiskLevel、types/PrivacyRiskLevel、constructors（RiskItemConstructor）、logTemplates、errorMessages、筛选器、RiskTag 展示组件均有引用。
- ReviewStatus: constants/ReviewStatus、types/ReviewStatus、constructors（ReviewNoteConstructor/RiskItemConstructor）、logTemplates、errorMessages、handoverService 的未处理/已结论分组（UnhandledReviewStatuses、ConcludedReviewStatuses）、审阅页筛选器、StatusBadge/ReviewChecklist 展示组件均有引用。
- RiskCategory（COLLECTION 数据收集 / SHARING 数据共享 / RETENTION 保存期限）：constants/RiskCategory、types/RiskCategory、types/RiskItem 与 types/PolicyVersionChange、constructors/RiskItemConstructor、logTemplates、statusText、useHandoverFilters 筛选器、交接台/风险页/负责人视图（OwnerBoard）展示组件均有引用。


## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT

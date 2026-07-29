# AGENTS.md

写给在本仓库工作的 AI 协作者（Codex / Claude / 其他 agent）。人类协作者请先看 [README.md](README.md) 和 [docs/HANDOFF.md](docs/HANDOFF.md)。

## 这是什么项目

**AI 场景战略解码与访谈 Copilot（fde-copilot）** —— 面向企业 AI 咨询项目的 AI-native Mission System。顾问从行业模板和企业战略假设出发，开展多场业务访谈，从访谈证据中提炼 AI 机会卡，再生成 ProcessTwin 流程图和 One Page Card 交付物。

不是会议纪要工具，不是流程图工具，不是传统多页面 SaaS。AI 的职责是主动维护任务状态、判断偏差、推荐下一步动作，而不是多堆几个分析卡片。

核心对象层级（不要自行改动）：

```text
IndustryTemplate
→ Enterprise
→ StrategicContext
→ Interview
→ Evidence
→ AIOpportunityCard
→ ProcessTwin
→ Deliverable
```

## 技术栈

- **Vite 8** + **React 19**，`type: module`，JSX（暂未接入 TypeScript）
- **oxlint** 做 lint，配置在 `.oxlintrc.json`
- npm 管理依赖
- 当前无后端；**不要接入真实 API 或付费服务**

## 目录结构

```text
fde-copilot/
├── AGENTS.md              # 本文件：AI 协作者规范
├── README.md              # 项目总览、运行方式、文档索引、当前进度
├── docs/                  # 产品与工程 harness 文档（真源，见下表）
├── src/                   # 应用代码（目前仍是 Vite 脚手架）
│   ├── main.jsx           # 入口
│   ├── App.jsx            # 根组件
│   ├── App.css / index.css
│   └── assets/
├── public/                # 静态资源
├── index.html             # Vite HTML 入口
├── vite.config.js
├── .oxlintrc.json
└── package.json
```

`docs/` 各文件作用：

| 文件 | 作用 |
| --- | --- |
| `docs/PRD.md` | 产品背景、目标、对象层级、关键流程、默认 8 问提纲 |
| `docs/ADR.md` | 已确认架构决策 ADR-001 ~ ADR-013 |
| `docs/DATA_MODEL.md` | 对象归属、source types、confirmation status |
| `docs/PRODUCT_PRINCIPLES.md` | 11 条产品原则 |
| `docs/HARNESS.md` | 产品迭代总控流程 |
| `docs/SKILL.md` | product-design-harness：设计判断与任务生成规范 |
| `docs/CODEX_EXECUTION_HARNESS.md` | 代码执行规范（改动前/中/后） |
| `docs/QA_GATES.md` | 五组质量闸门 |
| `docs/HANDOFF.md` | 新成员交接说明 |

## 启动命令

```bash
npm install     # 安装依赖
npm run dev     # 开发服务器（默认 http://localhost:5173）
npm run build   # 生产构建 —— 每轮改动结束必须跑通并汇报结果
npm run preview # 预览生产构建
npm run lint    # oxlint
```

## 修改代码前必须做的事

**动任何代码之前，先读 [docs/PRD.md](docs/PRD.md) 和 [docs/ADR.md](docs/ADR.md)。**

- `docs/PRD.md` 定义产品要解决什么、对象怎么组织、流程怎么走。
- `docs/ADR.md` 是已经确认的架构决策。**不要重复推翻它们。** 如果确实需要改变某条 ADR，先停下来向用户说明理由并取得确认，再把新结论写回 `docs/ADR.md` 或 `docs/DATA_MODEL.md`。

涉及产品设计判断、信息架构调整、交互优化时，另外套用 [docs/SKILL.md](docs/SKILL.md)。

## 执行规范

**每轮改动必须遵循 [docs/CODEX_EXECUTION_HARNESS.md](docs/CODEX_EXECUTION_HARNESS.md)。** 摘要如下，以该文件为准：

改动前先声明：

1. 已读 AGENTS.md 与 `docs/*` harness 文件
2. 本轮改动属于哪一层（对象/数据模型层、工作流层、UI 交互层、视觉规范层、工程实现层）
3. 本轮修改的**单一**核心对象
4. 预计会改哪些文件
5. 明确的非目标（本轮不改什么）

改动过程中：

- 不删关键文件
- 不 reset Git
- **不 commit，不 push**
- 不接入真实 API 或付费服务
- 不改无关模块

改动完成后返回：

- 修改摘要
- 变更文件列表
- 数据模型变更
- UI / 工作流变更
- `npm run build` 结果
- 对照 [docs/QA_GATES.md](docs/QA_GATES.md) 的检查结果
- 遗留问题

## 常见反模式（不要做）

- 一轮同时改多个核心对象
- 把本该嵌入 mission workflow 的概念做成独立页面（例如把 Case Intelligence 拆成一级页面，违反 ADR-010）
- 没有数据血缘模型就先做 UI 卡片
- 把「AI-native」理解成「多加几个分析面板」
- 把行业模板默认值当成客户已确认事实（违反 ADR-004，必须标 `to_be_confirmed`）
- One Page Card 独立成一级业务对象（违反 ADR-005）
- 让 One Page Card 脱离源证据

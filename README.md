# AI 场景战略解码与访谈 Copilot（fde-copilot）

面向企业 AI 咨询项目的 AI-native Mission System：帮助顾问从行业模板和企业战略假设出发，开展多场业务访谈，从访谈证据中提炼 AI 机会卡，并进一步生成 ProcessTwin 流程图和 One Page Card 交付物。

它不是会议纪要工具，也不是普通流程图工具。核心区别在于：AI 主动维护任务状态、判断偏差、推荐 Next Best Move，并保证每个结论都能追溯到来源和确认状态。

## 核心对象层级

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

完整的归属规则见 [docs/DATA_MODEL.md](docs/DATA_MODEL.md)。

## 技术栈

| 项 | 选型 |
| --- | --- |
| 构建工具 | Vite 8 |
| 框架 | React 19（JSX，暂未接入 TypeScript） |
| Lint | oxlint（配置见 `.oxlintrc.json`） |
| 包管理 | npm |
| 后端 / API | 暂无，当前不接入真实 API 或付费服务 |

## 本地运行

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器（Vite，默认 http://localhost:5173）
```

其他命令：

```bash
npm run build    # 生产构建，提交前必须通过
npm run preview  # 本地预览生产构建产物
npm run lint     # oxlint 检查
```

## docs/ 目录说明

| 文件 | 作用 |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | 产品背景、目标、核心对象层级、关键用户流程、默认 8 问访谈提纲、AI-native 交互原则。**改代码前必读。** |
| [docs/ADR.md](docs/ADR.md) | 已确认的架构决策（ADR-001 ~ ADR-013）。**改代码前必读，不要重复推翻。** |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | 对象归属规则、source types、confirmation status 枚举。 |
| [docs/PRODUCT_PRINCIPLES.md](docs/PRODUCT_PRINCIPLES.md) | AI-native 与咨询方法论的 11 条产品原则。 |
| [docs/HARNESS.md](docs/HARNESS.md) | 每轮产品迭代的总控流程：分层、纠正的老问题、本轮核心对象、不改什么、QA Gate。 |
| [docs/SKILL.md](docs/SKILL.md) | product-design-harness skill：产品设计讨论与 Codex/Claude 任务生成的规范，含反模式清单和输出格式。 |
| [docs/CODEX_EXECUTION_HARNESS.md](docs/CODEX_EXECUTION_HARNESS.md) | Codex/Claude 的代码执行规范：改动前/中/后各要做什么、返回格式。 |
| [docs/QA_GATES.md](docs/QA_GATES.md) | 五组质量闸门：Mission Room / Data Model / ProcessTwin / Interview Setup / AIOpportunityCard。 |
| [docs/HANDOFF.md](docs/HANDOFF.md) | 新成员交接说明：产品是什么、为什么做、上手顺序、下一步迭代建议、多人协作方式。 |

新成员建议阅读顺序：`HANDOFF.md` → `PRD.md` → `DATA_MODEL.md` → `ADR.md` → `SKILL.md`。

## 当前进度

**文档层：已固化。** 9 份 harness 文档全部落盘到 `docs/`，对应 PRD 第 7 节「当前开发重点」的第 1 项。

**代码层：尚未开始。** `src/` 目前仍是 Vite + React 脚手架（`main.jsx` / `App.jsx` / 样式 / assets），没有业务代码，没有数据模型实现。

下一步按 [docs/HANDOFF.md](docs/HANDOFF.md) 第 9 节的顺序推进：

1. 企业层信息架构 + Interview Setup Wizard（行业模板预填、默认 8 问）
2. Interview Mission Room（Next Best Move、槽位复述确认、Q&A 待回答流）
3. AIOpportunityCard（从访谈证据生成多张机会卡）
4. ProcessTwin（机会卡下的 As-is / To-be 结构化流程）
5. Living One Page Card（随访谈证据持续生长的卡片校准页）

## 给 AI 协作者

见根目录 [AGENTS.md](AGENTS.md)。每轮只改一个核心对象，改动前必读 `docs/PRD.md` 和 `docs/ADR.md`，执行规范遵循 `docs/CODEX_EXECUTION_HARNESS.md`。

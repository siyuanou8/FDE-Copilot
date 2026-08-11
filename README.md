# AI 场景战略解码与访谈 Copilot（fde-copilot）

## 项目现状

**当前阶段：产品设计基础设施 + Mission Room 交互原型验证**

这套对象链（IndustryTemplate → Enterprise → StrategicContext → Interview →
Evidence → AIOpportunityCard → ProcessTwin → Deliverable）是完整的产品设计，
但当前实现是**前端原型，静态数据，无后端**——请勿理解为"已建成的 AI 咨询系统"。

**已完成：**
- 产品工作流设计（对象定义、归属规则、关键用户流程）
- 核心域模型（8 个对象、5 种来源类型、4 种确认状态）
- 画板设计标准与产品框架（`skill/fde-copilot/`）
- Mission Room 交互原型（三栏布局、Next Best Move、真实案例数据验证一条完整推导链）

**未实现：**
- 后端架构与数据持久化
- 真实 AI 推理管线（当前 Next Best Move 为静态展示，非模型实时生成）
- 多轮画板实现（当前仅 Mission Room 一屏落地，其余 9 屏为设计文档）
- 企业级数据集成

## 定义
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

## 仓库导图
fde-copilot/
│
├── AGENTS.md                          给 AI 协作者的项目说明书
├── README.md                          项目总览入口
│
├── docs/                              【Maggie 原始文档 · 只读】
│   ├── README.md                        说明本目录性质
│   ├── PRD.md                            产品需求文档
│   ├── HANDOFF.md                        新成员交接说明
│   ├── SKILL.md                          product-design-harness 规范（⚠️ 非我们的skill）
│   ├── PRODUCT_PRINCIPLES.md             11条产品原则
│   ├── HARNESS.md                        迭代总控流程
│   ├── ADR.md                            13条架构决策
│   ├── QA_GATES.md                       5组质量闸门
│   └── DATA_MODEL.md                     对象归属规则
│
├── skill/fde-copilot/                 【我们整理的工作手册 · 持续迭代】
│   ├── SKILL.md                          手册入口（铁律/对象链/画板标准/流程）
│   └── references/
│       ├── 01-product-foundation.md      产品根基
│       ├── 02-methodology-arguments.md   方法论论证素材
│       ├── 03-canvas-standard.md         画板设计标准
│       ├── 04-canvas-blueprint.md        画板蓝图（十屏清单+依据）
│       ├── 05-reverse-sedimentation.md   反向沉淀机制（原创设计）
│       ├── 06-constraints.md             约束体系（ADR+QA Gate）
│       ├── 07-project-status.md          项目现状与协作方式
│       └── 08-canvas-template.md         画板输出模板
│
├── src/                                【代码 · Mission Room v1 已实现】
│   ├── App.jsx                           访谈进行页（三栏布局）
│   ├── App.css / index.css               样式
│   ├── main.jsx                          启动入口
│   └── assets/                           图片素材（3个文件，当前均无引用）
│
├── public/                             静态资源（favicon等）
│
└── 配置文件                             package.json / vite.config.js / .oxlintrc.json / .gitignore


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

目录本身的只读约定见 [docs/README.md](docs/README.md)。

## skill/fde-copilot/ 目录说明

`docs/` 是 Maggie 提供的原始文档，只读；`skill/fde-copilot/` 是**我们自己整理的项目工作手册**，可持续迭代。

它把散落在 9 份原始文档和后续讨论中的共识，收敛成一份可直接执行的手册：项目是什么、方法论依据、画板设计标准、各屏蓝图、反向沉淀机制、约束边界、当前状态。接手这个项目、或要推进其中任何一环（画板设计、页面开发、视觉迭代、对外汇报）时，从这里进入。

| 文件 | 作用 |
| --- | --- |
| `skill/fde-copilot/SKILL.md` | **手册入口**：6 条铁律、核心对象链、画板设计标准、画一屏的五步流程、蓝图速览、协作方式，以及何时该去读下面哪一份 reference |
| `references/01-product-foundation.md` | 产品根基：产品是什么、给谁用、解决什么，对象定义与归属规则、来源类型、确认状态 |
| `references/02-methodology-arguments.md` | 方法论与论证素材：汇报 / 答辩时要用的论证，并区分哪些是 Whisper 自己的判断 |
| `references/03-canvas-standard.md` | 画板设计标准：画任何一屏之前必读的规格（每屏固定 9 样、三个密度来源） |
| `references/04-canvas-blueprint.md` | 画板蓝图：要画哪些屏、每屏定位与依据出处、各屏的边界追问方向 |
| `references/05-reverse-sedimentation.md` | 反向沉淀机制（**本项目原创设计**）：让行业模板从每次真实访谈中自己长出来 |
| `references/06-constraints.md` | 约束体系：已拍板的 ADR 与 QA Gate，不得推翻 |
| `references/07-project-status.md` | 项目现状与协作方式：进度、已知问题、协作须遵守的方式 |
| `references/08-canvas-template.md` | 画板输出模板：每屏统一使用的骨架，结构不自由发挥 |

> `SKILL.md` 带 `name: fde-copilot` frontmatter，可直接作为 Claude skill 使用；`references/` 按需加载，不必一次读完。

> ⚠️ `docs/SKILL.md`（Maggie 的 product-design-harness 规范）与 `skill/fde-copilot/SKILL.md`（我们的项目工作手册）是**两份不同的文件**，引用时请写全路径。

## 当前进度

**文档层：已固化。** 9 份 harness 原始文档全部落盘到 `docs/`，对应 PRD 第 7 节「当前开发重点」的第 1 项；我们自己的工作手册落在 `skill/fde-copilot/`。

**代码层：Interview Mission Room v1 已实现。** `src/App.jsx` 是一个纯前端静态演示页（无后端、无持久化），以万华化学研发部门访谈为样例数据，已落地：

- **三栏布局**：左栏访谈 Q&A 流（含进度条与 8 问分组）、中栏受访者回答输入、右栏 Next Best Move + AI 机会卡
- **Next Best Move**：给出追问问题，并同时说明「为什么问 / 服务哪个北极星 / 补哪个槽位缺口」
- **来源与确认状态标注**：每条内容都带 source 与 status（`confirmed` / `to_be_confirmed`），区分客户原话、客户材料、顾问推断、AI 生成、示例占位数据，对应 [docs/DATA_MODEL.md](docs/DATA_MODEL.md) 的枚举
- **采纳交互**：点击「采纳并加入 Q&A 流」，把 AI 追问写入左栏作为「待回答」条目

尚未实现：Interview Setup Wizard、多张机会卡生成、ProcessTwin、One Page Card，以及回答提交后的 AI 判断逻辑（当前提交仅记录到本地演示状态）。

下一步按 [docs/HANDOFF.md](docs/HANDOFF.md) 第 9 节的顺序推进：

1. 企业层信息架构 + Interview Setup Wizard（行业模板预填、默认 8 问）
2. Interview Mission Room 深化（槽位复述确认、Q&A 待回答流的完整闭环）
3. AIOpportunityCard（从访谈证据生成多张机会卡）
4. ProcessTwin（机会卡下的 As-is / To-be 结构化流程）
5. Living One Page Card（随访谈证据持续生长的卡片校准页）

## 给 AI 协作者

见根目录 [AGENTS.md](AGENTS.md)。每轮只改一个核心对象，改动前必读 `docs/PRD.md` 和 `docs/ADR.md`，执行规范遵循 `docs/CODEX_EXECUTION_HARNESS.md`。

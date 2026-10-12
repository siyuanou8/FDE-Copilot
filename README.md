# AI 场景战略解码与访谈 Copilot（fde-copilot）

## 项目现状

**当前阶段：可操作产品原型（画面 1–12）+ 产品展示页 v0.5**

👉 **在线查看**：https://fde-copilot-xi.vercel.app/showcase.html （建议用电脑打开）

这套对象链（IndustryTemplate → Enterprise → StrategicContext → Interview →
Evidence → AIOpportunityCard → ProcessTwin → Deliverable）是完整的产品设计，
但当前实现以**前端原型 + 示例数据**为主，后端刚开始接入（目前只有逐句 AI 分析）——请勿理解为"已建成的 AI 咨询系统"。示例企业「华衡精密制造」为虚构。

**已完成：**
- 产品工作流设计（对象定义、归属规则、关键用户流程）与核心域模型
- 画板蓝图 v2.1：入口 + 7 章 19 个画面（`skill🤠/fde-copilot/references/04-canvas-blueprint.md`）
- 可操作原型（`public/prototype.html`）：画面 1–12，从企业列表一路点到假设看板
  - 建档与准备：企业列表、新建企业（行业 + 业务模式两组标签生成待验证清单）、访谈前预读（材料三个入口、覆盖状态、按「假设 → 材料 → 访谈」排出访谈优先级）
  - 访谈设置：AI 建议访谈对象、按部门 × 行业 × 业务模式改写提纲、录音同意与麦克风检测、模型选择示意
  - 访谈现场：实时转写与 AI 标注、提纲外追问、顾问采纳、复述确认、现场校准北极星
  - 收尾与企业全景：机会卡草稿、按标签反向沉淀、假设看板
- 产品展示页（`public/showcase.html`）：七章讲解，第一至五章嵌入同一份原型逐步演示

**未实现：**
- 画面 13–19（机会卡校准、One Page Card、ProcessTwin、交付物、证据溯源、跨企业待办、模板管理）与入口页
- 数据持久化；原型中除「真实 AI」输入条以外，AI 输出仍为预设演示（页面已标注）
- 每屏的画板设计文档（边界问题、注解、QA 自查）

**下一步**：数据保存（数据库）；画面 13–19；实时录音转写（服务选型与数据合规待定）；画板设计文档。

**已接入的后端**：`api/analyze.js`——访谈现场逐句分析。顾问输入客户的一句话，后端调大模型（默认 DeepSeek `deepseek-flash`）返回槽位、假设印证 / 否定、深挖点与追问建议；顾问发言不调模型；只接受本站来源的请求。原型访谈现场的「真实 AI」输入条即调用此接口。

> 早期的 Mission Room v1（`src/App.jsx`，Vite 应用）仍在仓库根路径部署，已被上述原型取代。

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
| 后端 / API | Vercel Functions（`api/`）；大模型 DeepSeek，密钥在 Vercel 环境变量 |

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
```
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
├── skill🤠/fde-copilot/                【我们整理的工作手册 · 持续迭代】
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
├── src/                                【代码 · Mission Room v1 已实现·仍需优化】
│   ├── App.jsx                           访谈进行页（三栏布局）
│   ├── App.css / index.css               样式
│   ├── main.jsx                          启动入口
│   └── assets/                           图片素材（3个文件，当前均无引用）
│
├── public/                             静态资源（favicon等）
│
└── 配置文件                             package.json / vite.config.js / .oxlintrc.json / .gitignore
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

目录本身的只读约定见 [docs/README.md](docs/README.md)。

## skill🤠/fde-copilot/ 目录说明

`docs/` 是 Maggie 提供的原始文档，只读；`skill🤠/fde-copilot/` 是**我们自己整理的项目工作手册**，可持续迭代。

它把散落在 9 份原始文档和后续讨论中的共识，收敛成一份可直接执行的手册：项目是什么、方法论依据、画板设计标准、各屏蓝图、反向沉淀机制、约束边界、当前状态。接手这个项目、或要推进其中任何一环（画板设计、页面开发、视觉迭代、对外汇报）时，从这里进入。

| 文件 | 作用 |
| --- | --- |
| `skill🤠/fde-copilot/SKILL.md` | **手册入口**：6 条铁律、核心对象链、画板设计标准、画一屏的五步流程、蓝图速览、协作方式，以及何时该去读下面哪一份 reference |
| `references/01-product-foundation.md` | 产品根基：产品是什么、给谁用、解决什么，对象定义与归属规则、来源类型、确认状态 |
| `references/02-methodology-arguments.md` | 方法论与论证素材：汇报 / 答辩时要用的论证，并区分哪些是 Whisper 自己的判断 |
| `references/03-canvas-standard.md` | 画板设计标准：画任何一屏之前必读的规格（每屏固定 9 样、三个密度来源） |
| `references/04-canvas-blueprint.md` | 画板蓝图：要画哪些屏、每屏定位与依据出处、各屏的边界追问方向 |
| `references/05-reverse-sedimentation.md` | 反向沉淀机制（**本项目原创设计**）：让行业模板从每次真实访谈中自己长出来 |
| `references/06-constraints.md` | 约束体系：已拍板的 ADR 与 QA Gate，不得推翻 |
| `references/07-project-status.md` | 项目现状与协作方式：进度、已知问题、协作须遵守的方式 |
| `references/08-canvas-template.md` | 画板输出模板：每屏统一使用的骨架，结构不自由发挥 |

> `SKILL.md` 带 `name: fde-copilot` frontmatter，可直接作为 Claude skill 使用；`references/` 按需加载，不必一次读完。

> ⚠️ `docs/SKILL.md`（Maggie 的 product-design-harness 规范）与 `skill🤠/fde-copilot/SKILL.md`（我们的项目工作手册）是**两份不同的文件**，引用时请写全路径。

## 给 AI 协作者

见根目录 [AGENTS.md](AGENTS.md)。每轮只改一个核心对象，改动前必读 `docs/PRD.md` 和 `docs/ADR.md`，执行规范遵循 `docs/CODEX_EXECUTION_HARNESS.md`。

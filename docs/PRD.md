# PRD｜AI 场景战略解码与访谈 Copilot

## 1. 产品背景

企业 AI 咨询项目中，顾问通常需要服务多个企业。每个企业有自己的行业背景、战略假设、北极星指标和核心能力。每个企业下面会发生多场访谈，每场访谈沉淀原始 Q&A、证据、槽位状态和追问；再从这些证据中推导出多个 AI 机会卡。每张 AI 机会卡承载一个可建设的 AI 场景机会，并天然对应一张 One Page Card。

本产品的目标不是做会议纪要，也不是做普通流程图工具，而是把顾问从访谈证据到 AI 机会卡交付的过程变成一个 AI-native Mission System。

## 2. 产品目标

- 帮助顾问在最少点击和最少输入下完成企业 AI 场景发现。
- 通过行业模板预填企业战略假设，而不是强制用户从空白开始。
- 在访谈中主动提示下一步最该问什么，降低顾问判断成本。
- 从 Q&A 原始证据中抽取槽位、识别偏差、推荐追问、沉淀 AI 机会卡。
- 将流程图作为结构化 ProcessTwin，而非普通画图。
- 将 One Page Card 作为 AI 机会卡的表达形态，而非独立业务对象。

## 3. 核心对象层级

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

### 3.1 IndustryTemplate
行业模板用于提供默认假设，包括行业痛点、北极星指标、核心能力、建议访谈部门、默认场景模式。行业模板内容必须标记为 `source = industry_template` 和 `status = to_be_confirmed`，不能直接视为客户事实。

### 3.2 Enterprise
企业是战略解码、访谈、AI 机会卡和交付物的上层容器。

### 3.3 StrategicContext
战略解码属于 Enterprise，不属于单次 Interview。战略解码是 nice-to-have，不是访谈阻塞项。新建企业并选择行业后，系统应先根据行业模板自动预填战略假设。

### 3.4 Interview
访谈是 raw data 原始材料。一个企业有多个访谈；一个访谈可以生成多个 AI 机会卡。

### 3.5 Evidence
证据来自客户原话、顾问提炼、案例启发、行业模板或 AI 推断。所有进入正式结论的内容必须有来源和确认状态。

### 3.6 AIOpportunityCard
AI 机会卡是从访谈证据中推导出的 AI 需求/场景机会。它同时承载 One Page Card 结构。一个 AI 机会卡对应一张卡片；未来可以关联多个访谈作为证据来源。

### 3.7 ProcessTwin
流程图底层是 ProcessTwin，属于 AI 机会卡。As-is 和 To-be 流程应保留阶段、泳道、节点、证据、痛点、AI 介入点和箭头关系。

## 4. 关键用户流程

### 4.1 新建企业
1. 用户输入企业名称并选择行业。
2. 系统根据 IndustryTemplate 自动预填企业战略假设。
3. 系统主动提示：是否创建第一场访谈。
4. 用户可选择“开始第一场访谈”或“先校准企业画像”。

### 4.2 新建访谈
1. 用户选择访谈部门和受访者角色。
2. 系统根据部门职责自动生成默认 8 问。
3. 用户可上传自定义问题，并选择覆盖或合并默认问题。
4. 进入 Interview Mission Room。

### 4.3 访谈进行中
系统应围绕当前问题自动推进：
- 显示当前第 X / 8 问。
- 用户填写或转写回答。
- 系统判断回答是否充分、是否偏离北极星。
- 系统给出 Next Best Move。
- 必要时生成追问、复述确认或进入下一问。

### 4.4 访谈结束后
系统主动提示识别出的 AI 机会卡草稿，并进入 AI 机会卡校准。

## 5. 默认访谈提纲

默认提纲通常为 8 个问题，分为三组：

### 组一：部门组成、业务范围及核心 KPI
1. 请介绍部门组织构成、主要职责和业务范围。
2. 当前部门最核心的 KPI 或管理目标是什么？

### 组二：流程、痛点、能力与数字化基础
3. 请以一个典型业务场景为例，介绍当前主要业务流程如何运转。
4. 流程中最耗时、最容易出错或最依赖经验的环节是什么？
5. 这些痛点背后，需要提升的核心业务能力是什么？
6. 当前有哪些系统、数据或数字化工具在支撑这个流程？数据质量如何？
7. 过去是否尝试过 AI、自动化或数字化改造？哪些有效，哪些失败，原因是什么？

### 组三：咨询服务期待
8. 对本次 AI 场景共创或咨询服务，最希望我们帮助解决什么问题，或形成什么结果？

问题应根据部门职责动态改写，例如售后服务、研发、制造交付、销售、财务、供应链等。

## 6. AI-native 交互原则

- 不让用户主动找下一步入口；系统应通过 Step Coach、Next Action Prompt、Next Best Move 主动引导。
- 企业战略解码不是阻塞项；行业模板先预填，后续再校准。
- 顾问现场最高优先级交互是 Next Best Move。
- One Page Card 是 Living Artifact，应随访谈持续生长。
- 每个结论都必须有来源、证据和确认状态。

## 7. 当前开发重点

近期优先级：
1. 固化 Product Design Harness、Codex Execution Harness 和 QA Gate。
2. 完成企业层信息架构。
3. 统一 Interview → Evidence → AIOpportunityCard 关系。
4. 完成 Interview Setup Wizard 与默认问题机制。
5. 优化 Interview Mission Room 的 Next Best Move。
6. 将 ProcessTwin 与 AI 机会卡联动。

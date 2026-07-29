# AI 场景战略解码与访谈 Copilot｜新成员交接说明

## 1. 一句话介绍

AI 场景战略解码与访谈 Copilot 是一个面向企业 AI 咨询项目的 AI-native Mission System。它帮助顾问从行业模板和企业战略假设出发，开展多场业务访谈，从访谈证据中提炼 AI 机会卡，并进一步生成 ProcessTwin 流程图和 One Page Card 交付物。

## 2. 为什么做这个产品

传统咨询访谈依赖顾问手动整理会议记录、追问问题、业务流程、痛点和交付物。这个过程存在四个问题：

1. 访谈信息分散，难以追溯到原始证据。
2. 顾问需要主动判断下一步该问什么。
3. 战略解码、访谈、场景机会、流程图和 One Page Card 容易割裂。
4. AI 工具往往只是生成总结，而不是帮助顾问判断真需求和推进下一步。

本产品的目标是让 AI 主动维护任务状态、判断偏差、推荐下一步动作，并把访谈证据转化为可交付的 AI 机会卡。

## 3. 当前核心原则

- AI-native 不是增加 AI 卡片，而是让 AI 主动推进任务。
- 行业模板先预填战略假设，企业战略解码是校准项，不是访谈阻塞项。
- 顾问现场最高优先级是 Next Best Move。
- Interview 是原始材料，不是最终 AI 需求。
- AI Opportunity Card 是从访谈证据中推导出的 AI 场景机会。
- One Page Card 是 AI 机会卡的表达形态，不是独立一级对象。
- ProcessTwin 是流程图结构化真源，不只是画图。
- 每个结论必须有来源和确认状态。

## 4. 核心对象关系

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

## 5. 典型用户路径

1. 顾问新建企业，只输入企业名称和行业。
2. 系统根据行业模板预填北极星、行业痛点、核心能力和建议访谈部门。
3. 系统主动建议开始第一场访谈。
4. 用户选择访谈部门和受访者身份。
5. 系统生成默认 8 问访谈提纲；用户可上传自定义问题覆盖或合并。
6. 访谈过程中，系统持续提示 Next Best Move、追问、复述确认和槽位缺口。
7. 访谈结束后，系统从证据中生成多个 AI 机会卡。
8. 每张 AI 机会卡可进入流程图、卡片校准和交付物生成。

## 6. 默认访谈问题结构

默认约 8 问，分三组：

1. 部门组成、业务范围及核心 KPI。
2. 业务流程、现有痛点、核心业务能力、数字化支撑、数据质量、成功/失败案例。
3. 对本次咨询服务的期待。

问题文案应根据部门职责动态改写。

## 7. 当前交付给新成员的文件

- `docs/PRD.md`：产品背景、目标、对象关系和关键流程。
- `docs/SKILL.md`：GPT/Codex/Claude 迭代时使用的产品设计 harness。
- `docs/HARNESS.md`：每轮产品迭代总控流程。
- `docs/PRODUCT_PRINCIPLES.md`：AI-native 与咨询方法论原则。
- `docs/DATA_MODEL.md`：对象归属和数据层级。
- `docs/ADR.md`：已确认的架构决策。
- `docs/QA_GATES.md`：质量闸门。
- `docs/CODEX_EXECUTION_HARNESS.md`：Codex/Claude 执行规范。

## 8. 新成员上手建议

第一步：先读 `docs/PRD.md` 和 `docs/DATA_MODEL.md`。

第二步：读 `docs/ADR.md`，不要重复推翻已确认的对象关系。

第三步：任何修改前先套用 `docs/SKILL.md`。

第四步：每轮只改一个核心对象，并对照 `docs/QA_GATES.md` 验收。

## 9. 下一步建议

短期建议继续围绕以下主题迭代：

1. Interview Setup Wizard：行业模板预填 + 默认访谈提纲。
2. Interview Mission Room：Next Best Move、槽位复述确认、Q&A 待回答流。
3. AIOpportunityCard：从访谈证据生成多张 AI 机会卡。
4. ProcessTwin：AI 机会卡下的 As-is / To-be 结构化流程。
5. Living One Page Card：随访谈证据持续生长的卡片校准页。

## 10. GPT 多人协作建议

- 使用共享 Project 作为团队工作空间，集中放置 PRD、Skill、Harness、ADR、QA Gates 和关键截图。
- ChatGPT 负责产品讨论、结构判断、QA 复核和 Codex/Claude 任务生成；Codex/Claude X 负责代码执行。
- 每轮协作必须先说明本轮修改对象和不改内容，再对照 QA Gate 验收。
- 结构性结论应及时写入 ADR 或 DATA_MODEL，避免新成员重复推翻。

# docs/ 目录说明

本目录存放 **Maggie 提供的项目原始文档**，共 9 份。

**这些文件只读：不修改、不覆盖、不重排。** 需要补充或纠正的内容，写到我们自己的工作手册里，不要动这里的原文。

## 9 份原始文档

| 文件 | 作用 |
| --- | --- |
| [PRD.md](PRD.md) | 产品背景、目标、核心对象层级、关键用户流程、默认 8 问访谈提纲、AI-native 交互原则 |
| [HANDOFF.md](HANDOFF.md) | 新成员交接说明：产品是什么、为什么做、上手顺序、下一步迭代建议、多人协作方式 |
| [SKILL.md](SKILL.md) | **product-design-harness skill**：产品设计讨论与 Codex/Claude 任务生成的规范，含反模式清单和输出格式 |
| [PRODUCT_PRINCIPLES.md](PRODUCT_PRINCIPLES.md) | AI-native 与咨询方法论的 11 条产品原则 |
| [HARNESS.md](HARNESS.md) | 每轮产品迭代的总控流程：分层、纠正的老问题、本轮核心对象、不改什么、QA Gate |
| [ADR.md](ADR.md) | 已确认的架构决策（ADR-001 ~ ADR-013） |
| [QA_GATES.md](QA_GATES.md) | 五组质量闸门：Mission Room / Data Model / ProcessTwin / Interview Setup / AIOpportunityCard |
| [DATA_MODEL.md](DATA_MODEL.md) | 对象归属规则、source types、confirmation status 枚举 |
| [CODEX_EXECUTION_HARNESS.md](CODEX_EXECUTION_HARNESS.md) | Codex/Claude 的代码执行规范：改动前 / 中 / 后各要做什么、返回格式 |

## 我们自己整理的工作手册在哪

在 [`skill/fde-copilot/`](../skill/fde-copilot/)，不在本目录。

那是我们基于这些原始文档 + 后续讨论共识，自己沉淀的一份可执行工作手册（SKILL.md + references/ 下 8 份参考文件）。它可以持续更新迭代；本目录的 9 份原始文档不可以。

## ⚠️ 两个 SKILL.md，不要混淆

| 路径 | 是什么 | 能否修改 |
| --- | --- | --- |
| `docs/SKILL.md` | Maggie 的 **product-design-harness** 规范 | ❌ 只读 |
| `skill/fde-copilot/SKILL.md` | 我们自己的 **fde-copilot** 项目工作手册入口 | ✅ 可迭代 |

两份是**完全不同的文件**，内容、作者、用途都不一样。引用时请写全路径。

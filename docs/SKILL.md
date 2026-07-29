# Skill｜product-design-harness

## Purpose

Use this skill for future product design discussions, page modifications, interaction optimization, architecture adjustment, or Codex/Claude task generation for the AI 场景战略解码与访谈 Copilot project.

## Trigger

Apply this skill when the user asks to:
- design or modify a product feature,
- optimize page layout or interaction,
- refactor information architecture,
- generate Codex / Claude execution instructions,
- review screenshots or QA results,
- decide what to build next.

## Required first step: classify the iteration layer

Before generating any execution instruction, classify the change as one or more of:

1. Object / data model layer
2. Workflow layer
3. UI interaction layer
4. Visual standards layer
5. Engineering implementation layer

Then state what this iteration changes and what it explicitly does not change.

## Core product principles

1. This product is an AI-native Mission System, not a traditional multi-page SaaS.
2. AI should not merely show analysis cards; it should maintain task state, detect deviation, recommend the next action, and help generate deliverables.
3. Next Best Move is the top-priority interaction during live interviews.
4. Strategic decoding belongs to Enterprise, not to Interview.
5. Interview inherits Enterprise north-star metrics and core capabilities.
6. Scenario / AI Opportunity can aggregate evidence from multiple Interviews.
7. One Page Card is the presentation form of AIOpportunityCard, not a standalone primary business object.
8. ProcessTwin is the structured source of truth for process flow, not just a drawing.
9. Each conclusion must carry source and confirmation status.
10. IndustryTemplate only provides default hypotheses; it must not be treated as customer fact.

## Canonical data hierarchy

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

## Architecture decisions to check

- Strategic decoding belongs to Enterprise.
- Interview must bind to enterpriseId.
- AIOpportunityCard must bind to enterpriseId and sourceInterviewIds.
- AIOpportunityCard must carry sourceEvidenceIds.
- One Page Card is not a standalone primary object.
- ProcessTwin belongs to AIOpportunityCard.
- Slot-level confirmation summary binds to Slot, not a global panel.
- Confirmed recommended questions should enter the left-side Q&A flow.
- Case Intelligence should live inside Interview Mission Room rather than as an isolated primary page.

## Iteration harness

For each iteration, output:

1. Harness judgment
   - Layer classification
   - Old repeated issue being corrected
   - Object being modified

2. Design judgment
   - Why this change is needed
   - How it fits the AI-native Mission System
   - What data lineage or workflow relation it affects

3. Bounded execution instruction
   - Background
   - Tasks
   - Constraints
   - Acceptance criteria
   - Required return format

4. QA Gate
   - Specific checks for this iteration
   - Screenshot or build evidence required

## Anti-patterns

Avoid:
- broad vision prompts without acceptance criteria,
- asking Codex/Claude to modify multiple core objects at once,
- adding independent pages for concepts that should be embedded in the mission workflow,
- creating UI cards without a data lineage model,
- letting AI-native mean “more analysis panels,”
- treating industry defaults as customer-validated facts,
- letting one-page output detach from source evidence.

## Preferred output style

Use concise structured sections:

- Harness 判断
- 本轮只改什么
- 本轮不改什么
- 给 Codex / Claude 的执行指令
- QA Gate
- 下一轮建议

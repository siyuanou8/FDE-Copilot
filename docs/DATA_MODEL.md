# DATA MODEL

## Canonical hierarchy

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

## Ownership rules

- IndustryTemplate: default hypotheses only.
- Enterprise: client-level workspace.
- StrategicContext: belongs to Enterprise.
- Interview: belongs to Enterprise; raw material and evidence collection.
- Evidence: atomic source item from Q&A, consultant refinement, case inspiration, industry template, or AI inference.
- AIOpportunityCard: AI opportunity derived from evidence; can reference one or multiple interviews.
- ProcessTwin: belongs to AIOpportunityCard.
- One Page Card: presentation form inside AIOpportunityCard.
- Deliverable: enterprise-level or opportunity-level output.

## Source types

- customer_quote
- consultant_refinement
- case_inspiration
- industry_template
- ai_inference

## Confirmation status

- to_be_confirmed
- draft
- confirmed
- rejected

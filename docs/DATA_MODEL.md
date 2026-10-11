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
- Evidence: atomic source item from Q&A, consultant refinement, case inspiration, industry template, client material, or AI inference.
- AIOpportunityCard: AI opportunity derived from evidence; can reference one or multiple interviews.
- ProcessTwin: belongs to AIOpportunityCard.
- One Page Card: presentation form inside AIOpportunityCard.
- Deliverable: enterprise-level or opportunity-level output.

## Source types

- customer_quote
- consultant_refinement
- case_inspiration
- industry_template
- client_material — documents with an original citation: client-provided files, official disclosures (annual reports, announcements), public sources. Must cite file, page or URL, and date. Added 2026-10.
- ai_inference — content the AI derives or estimates that the original text does not state directly; must cite the material it is based on.

## Confirmation status

- to_be_confirmed
- draft
- confirmed
- rejected

# QA GATES

## Mission Room QA Gate

- Consultant can see the next best question within 3 seconds.
- Next Best Move appears in the first screen of the right action area.
- It shows why to ask, which north-star metric it serves, and which slot gap it closes.
- Case Intelligence serves the current question; it is not a standalone case wall.
- Candidate requirement descriptions show source and confirmation status.

## Data Model QA Gate

- Interview has enterpriseId.
- AIOpportunityCard has enterpriseId, sourceInterviewIds, and sourceEvidenceIds.
- StrategicContext belongs to Enterprise.
- One Page Card is not a standalone primary business object.
- IndustryTemplate defaults are marked to_be_confirmed.

## ProcessTwin QA Gate

- Flow is stage × swimlane grid.
- Nodes stay inside stage/lane cells.
- Node footprint is consistent.
- AI is expressed via tag, not arbitrary color.
- Decision nodes are short questions.
- Arrows are orthogonal, with consistent path styles.
- JSON panel is collapsed by default.

## Interview Setup QA Gate

- New enterprise requires only enterprise name + industry.
- Industry template pre-fills strategic hypotheses.
- Strategic decoding is not blocking interview start.
- Department selection generates default interview guide.
- Default guide has 8 questions in 3 groups.
- User can override or merge custom questions.

## AIOpportunityCard QA Gate

- One interview can generate multiple cards.
- Each card carries source interviews and evidence.
- Each card has maturity score and status.
- Each card has or can link to As-is / To-be ProcessTwin.
- Card fields show source and confirmation status.

# HARNESS｜Product Design Harness

## Purpose

This harness controls product design and development iteration for AI 场景战略解码与访谈 Copilot.

## Iteration check

Before any product or code change, answer:

1. Which layer is this iteration changing?
   - Object / data model layer
   - Workflow layer
   - UI interaction layer
   - Visual standards layer
   - Engineering implementation layer

2. Which repeated problem is being corrected?
   - Page fragmentation
   - Wrong data ownership
   - AI-native reduced to cards/panels
   - Next step not obvious to consultant
   - Evidence/source not traceable
   - Flow diagram not professional or not structured
   - One Page Card disconnected from evidence

3. What is the single core object of this iteration?

4. What explicitly does not change?

5. What is the QA Gate?

## Development principle

Use progressive ontology + vertical slice:
- Build a usable vertical slice quickly.
- Let the demo expose structure problems.
- When a structure issue appears, stop adding features and consolidate the data model / ADR.
- Continue only after QA Gate passes.

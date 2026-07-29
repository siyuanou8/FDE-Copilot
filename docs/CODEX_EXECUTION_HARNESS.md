# CODEX EXECUTION HARNESS

## Execution rules

Before modifying code:
1. Read AGENTS.md and docs/* harness files.
2. Classify the change layer.
3. State the single core object being modified.
4. State files likely to change.
5. State explicit non-goals.

During modification:
- Do not delete critical files.
- Do not reset Git.
- Do not commit or push.
- Do not connect real APIs or paid services.
- Do not modify unrelated modules.

After modification:
Return:
- Modification summary
- Files changed
- Data model changes
- UI/workflow changes
- npm run build result
- QA Gate checklist result
- Remaining issues

# Disabled Tests

> **Status:** DISABLED — These test files reference the old project structure (`../types`, `../services/`) which no longer exists in the active codebase.
>
> **Disabled on:** 2026-06-10
> **Reason:** Test files import from `../types`, `../services/directAnalysisEnhancer`, `../services/ruleBasedAnalyzer`, etc. which have been moved to `_disabled_services/`. These tests need to be rewritten for the current active source structure under `src/`.
>
> **To re-enable:** Rename this directory back to `tests/` and update all imports to reference the current project structure.

## Files in this directory

- `directAnalysisTest.ts` — Imports from `../types` and `../services/directAnalysisEnhancer`
- `finalVerification.ts` — Verification script for Supabase removal
- `fullAnalysisFlow.test.ts` — Integration test for analysis flow
- `ruleBasedAnalyzer.test.ts` — Unit tests for rule-based analyzer
- `verification.js` — General verification script

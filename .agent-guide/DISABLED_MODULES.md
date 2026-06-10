# Disabled Modules

This document catalogs all disabled (renamed) modules in the project, why they were disabled, and how to re-enable them.

## Summary

| Disabled Directory | Original Name | Files | Disabled On | Reason |
|-------------------|---------------|-------|-------------|--------|
| `_disabled_components/` | `components/` | 45 | 2026-06-10 | Dead code — not imported by active src/ |
| `_disabled_services/` | `services/` | 21 | 2026-06-10 | Dead code + Supabase deprecation |
| `_disabled_tests/` | `tests/` | 5 | 2026-06-10 | Broken imports referencing old structure |

---

## _disabled_components/ (45 files)

### Why Disabled
These 45 React components were part of an earlier version of the app (pre-Next.js migration). None are imported by any file under `src/`. Active components live in `src/components/krishi/` and `src/components/ui/`.

### File List
About.tsx, AgriPodcast.tsx, AIYieldPredictor.tsx, Analyzer.tsx, AppUtility.tsx, BiocontrolGuide.tsx, CABIDiagnosisTraining.tsx, ChatBot.tsx, CropCalendar.tsx, CropDiseaseLibrary.tsx, DynamicPrecisionForm.tsx, EnhancedCABIDiagnosisTraining.tsx, FAQ.tsx, FeatureHighlights.tsx, FeedbackModal.tsx, FarmerAvatar.tsx, FieldMap.tsx, FieldMonitoring.tsx, FlashcardView.tsx, GoogleAdBanner.tsx, GuidedTour.tsx, Hero.tsx, HomeSections.tsx, LearningCenter.tsx, LeafColorChart.tsx, Logo.tsx, MarketPriceHorizontal.tsx, NutrientCalculator.tsx, OptimizedAnalyzer.tsx, PesticideExpert.tsx, PlantDefenseGuide.tsx, QRGenerator.tsx, SearchTool.tsx, ShareDialog.tsx, SoilExpert.tsx, SoilGuide.tsx, StudentHub.tsx, TaskScheduler.tsx, ToolGuideHeader.tsx, ToolsHub.tsx, UserProfile.tsx, VideoGenerator.tsx, Weather.tsx, WeatherHorizontal.tsx, YieldCalculator.tsx

### How to Re-enable
1. Rename `_disabled_components/` back to `components/`
2. Update imports in your `src/` files to reference the root components
3. Remove `_disabled_components/` from `tsconfig.json` exclude list
4. Remove `_disabled_components/` from `.gitignore`

---

## _disabled_services/ (21 files)

### Why Disabled
These 21 service files are legacy code not referenced by the active Next.js application. This directory also contains **Supabase-related services** that have been replaced by Prisma for database operations.

### Supabase-Specific Files (DEPRECATED)
| File | Purpose | Prisma Replacement |
|------|---------|-------------------|
| `supabase.ts` | Supabase client, user sync, report saving | `src/lib/db.ts` (Prisma) |
| `supabaseStorage.ts` | File upload/storage operations | Not yet migrated — use cloud storage SDK |
| `csvLoader.ts` | CSV loading from Supabase storage URLs | Static data files in `data/` |

### Other Legacy Files
bangladeshPrompts.ts, directAnalysisEnhancer.ts, enhancedCostAwareAnalyzer.ts, enhancedRuleBasedAnalyzer.ts, firebase.ts, geminiService.ts, huggingfaceService.ts, localClassifierWeb.ts, locationService.ts, modelService.ts, ruleBasedAnalyzer.ts, shareService.ts

### Search Subdirectory
search/cache/searchCache.ts, search/handlers/deployHandler.ts, search/handlers/marketHandler.ts, search/knowledgeBase/deploymentFAQs.ts, search/queryClassifier.ts, search/types/searchTypes.ts

### How to Re-enable (Non-Supabase)
1. Rename `_disabled_services/` back to `services/`
2. Update imports in your `src/` files
3. Remove from `tsconfig.json` exclude and `.gitignore`

### How to Re-enable (Supabase)
1. Follow the steps above
2. Install Supabase client: `npm install @supabase/supabase-js`
3. Add environment variables: `SUPABASE_URL`, `SUPABASE_KEY`
4. Remove deprecation notices from docs
5. Note: This would create a dual-database situation — not recommended

---

## _disabled_tests/ (5 files)

### Why Disabled
Test files reference the old project structure (`../types`, `../services/directAnalysisEnhancer`, etc.) which have been moved to `_disabled_services/`. These tests need to be completely rewritten for the current source structure.

### File List
- `directAnalysisTest.ts` — Direct analysis system test
- `finalVerification.ts` — Supabase removal verification
- `fullAnalysisFlow.test.ts` — Full analysis flow integration test
- `ruleBasedAnalyzer.test.ts` — Rule-based analyzer unit tests
- `verification.js` — General verification script

### How to Re-enable
1. Rename `_disabled_tests/` back to `tests/`
2. Rewrite all test imports to reference `src/` files
3. Update test logic for current project structure
4. Install testing framework (Jest/Vitest) if not present

---

## Related Configuration Changes

When any disabled directory is re-enabled, also update:

1. **tsconfig.json** — Remove the directory from the `exclude` list
2. **.gitignore** — Remove the `_disabled_*` pattern
3. **.archived-files-manifest** — Update the status

## Supabase Deprecation Notices in Docs

The following documentation files have deprecation notices added (not deleted):
- `docs/deployment/DEPLOYMENT.md`
- `docs/deployment/CLOUDFLARE_DEPLOY.md`
- `docs/deployment/DEPLOYMENT_SUMMARY.md`
- `docs/deployment/DEPLOYMENT_READY.md`
- `docs/deployment/DEPLOYMENT_TEST.md`
- `docs/status/IMPLEMENTATION_COMPLETE.md`
- `docs/status/SECURITY_CHECKLIST.md`
- `docs/status/SECURITY_NOTICE.md`
- `docs/status/MULTIMODAL_STATUS.md`
- `krishi-ai-backend/render.yaml`
- `krishi-ai-backend/RENDER_DEPLOY.md`

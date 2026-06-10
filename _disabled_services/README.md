# Disabled Services

> **Status:** DISABLED — Not imported by any active code under `src/`.
>
> **Disabled on:** 2026-06-10
> **Reason:** These 21 service files are legacy/dead code not referenced by the active Next.js application. This directory also contains Supabase-related services that have been replaced by Prisma. Active services live in `src/lib/` and `src/services/`.
>
> **Supabase deprecation:** `supabase.ts` and `supabaseStorage.ts` in this directory used the Supabase client for database and storage operations. These have been superseded by Prisma for database operations. Storage operations should use a new provider when needed.
>
> **To re-enable:** Rename this directory back to `services/` and add the necessary imports in your `src/` files. Note: Supabase files will need `@supabase/supabase-js` reinstalled if re-enabled.

## Files in this directory

### Supabase-related (DEPRECATED — replaced by Prisma)
- supabase.ts — Supabase client, user profile sync, report saving
- supabaseStorage.ts — Supabase storage upload/URL/list/delete operations
- csvLoader.ts — CSV loading with hardcoded Supabase storage URLs

### Other services (legacy)
- bangladeshPrompts.ts, directAnalysisEnhancer.ts, enhancedCostAwareAnalyzer.ts
- enhancedRuleBasedAnalyzer.ts, firebase.ts, geminiService.ts
- huggingfaceService.ts, localClassifierWeb.ts, locationService.ts
- modelService.ts, ruleBasedAnalyzer.ts, shareService.ts
- search/cache/searchCache.ts, search/queryClassifier.ts
- search/types/searchTypes.ts, search/knowledgeBase/deploymentFAQs.ts
- search/handlers/marketHandler.ts, search/handlers/deployHandler.ts

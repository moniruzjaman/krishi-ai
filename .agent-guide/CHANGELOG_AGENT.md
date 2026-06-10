# Agent Changelog

This file logs all automated changes made by AI agents to the Krishi AI codebase.

---

## 2026-06-10 — Initial Agent Cleanup & Prisma Migration

**Agent:** Super Z (GLM-based AI assistant)

### Changes Made

#### 1. Disabled Dead Code Directories (not deleted)
- Renamed `components/` → `_disabled_components/` (45 files)
- Renamed `services/` → `_disabled_services/` (21 files)
- Renamed `tests/` → `_disabled_tests/` (5 files)
- Added README.md inside each disabled directory explaining contents
- Added directories to `.gitignore` and `tsconfig.json` exclude list

#### 2. Supabase → Prisma Migration
- Restored `src/lib/db.ts` (PrismaClient singleton)
- Rewrote `prisma/schema.prisma` with Krishi-domain models:
  - User, FarmerProfile, ScanResult, ChatMessage, DiseaseReport
- Generated Prisma client (v6.19.2)
- Created SQLite development database (`prisma/dev.db`)
- Added deprecation notices to 11 documentation files referencing Supabase
- Commented out Supabase env vars in `krishi-ai-backend/render.yaml`
- Created `.env` with `DATABASE_URL`

#### 3. Build Error Fixes
- **CRITICAL:** Added `_disabled_*` directories to `tsconfig.json` exclude list (was blocking build)
- **HIGH:** Fixed framer-motion type errors in `src/app/page.tsx` — added `as const` to `swipeTransition`
- **HIGH:** Fixed framer-motion type errors in `src/components/krishi/HomeTab.tsx` — added `as const` to `fadeUp` ease property
- **MEDIUM:** Removed unused `next-auth` dependency from `package.json`
- **MEDIUM:** Moved `prisma` from dependencies to devDependencies

#### 4. Configuration Updates
- Updated `.gitignore` with disabled directory patterns
- Updated `.archived-files-manifest` with disabled status
- Created `.env` file for development
- Pinned Prisma to v6 (v7 has breaking changes)

#### 5. Created Agent Guide
- Created `.agent-guide/` directory with comprehensive documentation:
  - README.md, ARCHITECTURE.md, PROJECT_STRUCTURE.md
  - CODING_STANDARDS.md, DATABASE.md, API_REFERENCE.md
  - COMPONENTS.md, DISABLED_MODULES.md, TROUBLESHOOTING.md
  - CHANGELOG_AGENT.md (this file)

### Build Status
- ✅ `next build` passes successfully
- ✅ TypeScript compilation passes
- ✅ Prisma client generated
- ✅ SQLite database created and synced

### Known Issues (Not Fixed)
- Missing `GEMINI_API_KEY` and `OPENROUTER_API_KEY` in `.env` (AI features won't work without them)
- ~12 unused npm dependencies in package.json (not removed, low priority)
- Supabase storage operations not yet migrated (no file upload capability)
- `src/lib/db.ts` exists but no active code imports it yet (ready for use but not wired)
- Node.js v24 compatibility issue with `proper-lockfile` (patched locally, lost on reinstall)

### Files Changed
| Action | File |
|--------|------|
| Renamed | `components/` → `_disabled_components/` |
| Renamed | `services/` → `_disabled_services/` |
| Renamed | `tests/` → `_disabled_tests/` |
| Created | `_disabled_components/README.md` |
| Created | `_disabled_services/README.md` |
| Created | `_disabled_tests/README.md` |
| Restored | `src/lib/db.ts` |
| Rewritten | `prisma/schema.prisma` |
| Modified | `src/app/page.tsx` (as const fix) |
| Modified | `src/components/krishi/HomeTab.tsx` (as const fix) |
| Modified | `tsconfig.json` (exclude list) |
| Modified | `.gitignore` (disabled dirs) |
| Modified | `.archived-files-manifest` (updated paths) |
| Modified | `package.json` (removed next-auth, moved prisma to devDeps) |
| Modified | 11 docs/config files (Supabase deprecation notices) |
| Created | `.env` |
| Created | `.agent-guide/` (9 documentation files) |

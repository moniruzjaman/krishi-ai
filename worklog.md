---
Task ID: 1
Agent: Super Z (Main)
Task: Clone repository, explore structure, identify issues

Work Log:
- Cloned https://github.com/moniruzjaman/krishi-ai
- Explored full project structure
- Identified Supabase usage in 3 service files + 11 docs
- Identified root components/ (45 files) and services/ (21 files) as dead code
- Found existing Prisma schema with generic User/Post models
- Found src/lib/db.ts was deleted but recoverable from git

Stage Summary:
- Project is Next.js 16 + React 19 + TypeScript
- Supabase is in dead code only (not in active src/)
- Prisma packages are in package.json but not used in active code
- Build initially fails due to dead code in TypeScript compilation

---
Task ID: 2
Agent: Super Z (Main)
Task: Disable dead code directories (not delete), migrate Supabase to Prisma, fix errors, create agent guide

Work Log:
- Renamed components/ → _disabled_components/ with README.md
- Renamed services/ → _disabled_services/ with README.md
- Renamed tests/ → _disabled_tests/ with README.md
- Restored src/lib/db.ts from git
- Rewrote prisma/schema.prisma with Krishi-domain models (User, FarmerProfile, ScanResult, ChatMessage, DiseaseReport)
- Generated Prisma client v6.19.2
- Created SQLite dev database with prisma db push
- Added deprecation notices to 11 docs referencing Supabase
- Commented out Supabase env vars in render.yaml
- Fixed CRITICAL: added _disabled_* to tsconfig.json exclude list
- Fixed HIGH: framer-motion 'as const' type errors in page.tsx and HomeTab.tsx
- Fixed MEDIUM: removed unused next-auth dependency
- Fixed MEDIUM: moved prisma to devDependencies
- Created .agent-guide/ with 9 comprehensive documentation files
- Ensured disabled directories are tracked by git (removed from .gitignore, kept in tsconfig exclude)
- Verified build passes successfully

Stage Summary:
- Build: ✅ PASSING
- Prisma: ✅ Client generated, DB synced (5 models, SQLite)
- Supabase: ✅ Fully disabled with deprecation notices (not deleted)
- Dead code: ✅ Disabled (renamed with _disabled_ prefix, tracked in git)
- Agent guide: ✅ Created with 9 comprehensive documents
- All changes are staged and ready for user approval before git push

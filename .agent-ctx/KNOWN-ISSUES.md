# Known Issues & Technical Debt

## Current Issues (as of 2026-06-10)

### 🟡 Prisma Schema Unused
- `prisma/schema.prisma` defines `User` and `Post` models (SQLite)
- `src/lib/db.ts` was a Prisma client singleton — **deleted** (was never imported)
- `@prisma/client` and `prisma` are still in package.json dependencies
- **Action needed**: Either remove Prisma dependencies entirely, or integrate a proper database for user data persistence

### 🟡 Tailwind Config Dead File
- `tailwind.config.ts` exists but Tailwind CSS v4 ignores it
- All actual theme tokens are in `src/app/globals.css` via `@theme inline`
- **Action needed**: Delete `tailwind.config.ts` to avoid confusion

### 🟡 Dead Code Directories
- `components/` (root) — 45 `.tsx` files from earlier iteration
- `services/` (root) — 21 `.ts` files from earlier iteration
- A manifest of these files exists at `.archived-files-manifest`
- **Action needed**: After review, delete both directories with `rm -r components/ services/`

### 🟡 Dual Deployment Duplication
- `src/app/api/` contains Next.js API routes (for Vercel)
- `functions/api/` contains Cloudflare Pages Functions (duplicate logic)
- **Action needed**: Consider extracting shared logic into a shared module

### 🟡 Service Worker Incomplete
- `public/sw.js` doesn't pre-cache the HTML shell or `_next/` chunks
- Offline experience is limited to cached API responses
- **Action needed**: Add critical asset pre-caching for full offline support

### 🟢 Sonner Component Unused
- `src/components/ui/sonner.tsx` imports `useTheme` from `next-themes`
- `next-themes` is a dependency but the app doesn't use theme switching
- The Sonner Toaster is never rendered in the layout
- **Action needed**: Remove `src/components/ui/sonner.tsx` and consider removing `next-themes` if unused

### 🟢 Test Files Outdated
- `tests/` directory contains tests for the old `services/` code
- These tests won't pass against the current codebase
- **Action needed**: Remove `tests/` or update tests for current architecture

## Resolved Issues (Fixed in This Session)

| Issue | Status | Fix Applied |
|-------|--------|-------------|
| Toast system conflict (ChatTab used sonner, layout mounted shadcn) | ✅ Fixed | Changed ChatTab to use `@/hooks/use-toast` |
| Unused import `getActiveModelLabel` in API routes | ✅ Fixed | Removed from both `chat/route.ts` and `analyze/route.ts` |
| `tsconfig.json` had `jsx: "react-jsx"` instead of `"preserve"` | ✅ Fixed | Changed to `"preserve"` (Next.js standard) |
| `next.config.ts` had `ignoreBuildErrors: true` | ✅ Fixed | Removed — TS errors now surface at build time |
| Missing 12 disease entries in `disease-db.ts` | ✅ Fixed | Added all 12 entries with full data |
| PWA manifest missing PNG icon | ✅ Fixed | Added `icon-192.png` entry to manifest |
| `.gitignore` missing common patterns | ✅ Fixed | Added `.next/`, `.env.local`, `*.db`, etc. |
| ESLint had almost all rules disabled | ✅ Fixed | Enabled `no-unused-vars`, `no-unreachable`, `prefer-const`, `exhaustive-deps` as warnings |
| Dead `src/lib/db.ts` file | ✅ Fixed | Deleted (PrismaClient singleton never imported) |

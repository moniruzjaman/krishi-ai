# Known Issues & Technical Debt

## Current Issues (as of 2026-11-06)

### 🟡 Dual Deployment Duplication
- `src/app/api/` contains Next.js API routes (for Vercel / OpenNext)
- `functions/api/` contains Cloudflare Pages Functions (duplicate logic)
- **Action needed**: Consider extracting shared logic into a shared module

### 🟡 Test Coverage Absent
- No formal test suite exists. `_disabled_tests/` holds legacy tests for the
  old `services/` code and will not pass against the current architecture
- **Action needed**: Add tests for `src/lib/gemini.ts` (3-tier cascade) and
  `src/app/api/*` route handlers

### 🟢 `functions/` Directory Unused by Primary Deploy
- The GitHub Actions workflow (`cf:build` → OpenNext → Cloudflare Workers)
  does not use `functions/`. It is only relevant for legacy Cloudflare Pages
- **Action needed**: Confirm whether legacy Pages deployment is still needed

### 🟢 Prisma References in Legacy Docs
- `docs/deployment/*` and `docs/status/*` still describe the Prisma/SQLite setup
  that was removed in this session
- **Action needed**: Refresh the stale deployment docs

## Resolved Issues (Fixed 2026-11-06)

| Issue | Status | Fix Applied |
|-------|--------|-------------|
| Dark mode not implemented (`next-themes` installed but unused) | ✅ Fixed | Added `ThemeProvider` (next-themes), `.dark` token overrides in `globals.css`, `ThemeToggle` in the app bar, `dark:` variants across all six tab components |
| Service worker did not cache the HTML shell or `_next/` chunks | ✅ Fixed | Rewrote `public/sw.js` (v4): network-first navigations with cached shell fallback, cache-first `_next/static`, RSC (`?_rsc=`) handling, `public/offline.html` |
| Prisma schema + `@prisma/client` unused and runtime-incompatible | ✅ Fixed | Deleted `prisma/schema.prisma`, `src/lib/db.ts`, the `@prisma/client` + `prisma` dependencies and the `db:*` scripts. SQLite Prisma cannot run on Cloudflare Workers (the primary deploy target) and `PROJECT.md` states no database is required |
| `tailwind.config.ts` was a dead file (Tailwind v4 ignores it) | ✅ Fixed | Deleted the file. All tokens live in `src/app/globals.css` via `@theme inline` |
| `src/components/ui/sonner.tsx` unused | ✅ Fixed | Deleted. Toasts use `@/hooks/use-toast` |
| Bell icon in the app bar did nothing | ✅ Fixed | Wired to `AlertSheet` — severe-weather alerts from Open-Meteo (keyless), with optional OS notifications |
| No privacy policy page | ✅ Fixed | Added `public/privacy.html` (required for Google Play / Apple App Store) |
| `.mat-card` / `.bottom-nav` / `.chat-bubble-assistant` hardcoded `background: white` | ✅ Fixed | Switched to the semantic `--card` / `--border` tokens so they follow the theme |

## Previously Resolved Issues (2026-06-10)

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

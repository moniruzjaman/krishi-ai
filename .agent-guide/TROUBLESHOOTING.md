# Troubleshooting Guide

## Build Issues

### Build fails with TypeScript errors from _disabled_* directories
**Symptom:** `next build` shows errors from `_disabled_components/` or `_disabled_services/`
**Fix:** These directories should be in `tsconfig.json` exclude list:
```json
"exclude": ["node_modules", "_disabled_components", "_disabled_services", "_disabled_tests", "krishi-ai-backend"]
```

### framer-motion type errors ("not assignable to type 'Transition'")
**Symptom:** TypeScript error about transition/variant types in page.tsx or HomeTab.tsx
**Fix:** Add `as const` to literal string values:
```tsx
// Wrong
transition: { ease: 'easeOut' }

// Correct
transition: { ease: 'easeOut' as const }
```

### Prisma client not generated
**Symptom:** `Cannot find module '@prisma/client'` or schema errors
**Fix:**
```bash
npx prisma generate
npx prisma db push
```

### Node.js v24 compatibility issue with proper-lockfile
**Symptom:** `TypeError: onExit is not a function` when running prisma commands
**Fix:** Patch `node_modules/proper-lockfile/lib/lockfile.js`:
```js
// Change line 6 from:
const onExit = require('signal-exit');
// To:
const signalExit = require('signal-exit');
const onExit = (typeof signalExit === 'function') ? signalExit : (signalExit.onExit || ((cb) => { process.on('exit', cb); }));
```
Note: This patch is lost on `npm install`. Pin Prisma to v6 to avoid this issue.

## Runtime Issues

### AI features not working (blank responses)
**Symptom:** Chat or analyzer returns empty/error responses
**Fix:** Ensure `GEMINI_API_KEY` is set in `.env` or `.env.local`
```
GEMINI_API_KEY=your_key_here
```
Get a key from: https://aistudio.google.com/apikey

### App falls back to rule-based analysis
**Symptom:** Diagnosis works but `method` is "rule_based" instead of "ai"
**Cause:** Gemini API key missing, invalid, or rate-limited
**Fix:** Check API key validity and quota

### localStorage data lost
**Symptom:** Chat history, scan results, or profile disappears
**Cause:** localStorage is cleared when browser storage is full or cleared
**Fix:** Implement Prisma-based persistence for critical data (see DATABASE.md)

### PWA install prompt not showing
**Symptom:** Install banner doesn't appear on mobile
**Cause:** Requires HTTPS, valid manifest.json, and service worker registration
**Fix:** Deploy to HTTPS environment (Vercel) and verify manifest.json

## Development Issues

### Hot reload creates multiple Prisma clients
**Symptom:** Warning about multiple PrismaClient instances in development
**Fix:** Use the singleton from `src/lib/db.ts` — it handles this automatically:
```typescript
import { db } from '@/lib/db'
```

### bun install fails with tarball extraction error
**Symptom:** `Fail extracting tarball for "lightningcss-linux-x64-musl"`
**Fix:** Try `bun install --ignore-scripts` then run scripts manually

### Port 3000 already in use
**Symptom:** `next dev` fails to start
**Fix:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9
# Or use a different port
next dev -p 3001
```

## Database Issues

### SQLite database not found
**Symptom:** Prisma can't find the database file
**Fix:** Ensure `DATABASE_URL="file:./dev.db"` in `.env` and run:
```bash
npx prisma db push
```

### Schema drift between code and database
**Symptom:** Prisma queries fail with column/table not found errors
**Fix:**
```bash
npx prisma db push --force-reset  # WARNING: destroys all data
# Or for safe migration:
npx prisma migrate dev --name your_change
```

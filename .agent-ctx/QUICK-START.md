# Quick Start Guide for Agents

## Prerequisites
- Node.js 18+ or Bun runtime
- (Optional) Gemini API key for AI features
- (Optional) OpenRouter API key for fallback AI

## Setup
```bash
cd krishi-ai
bun install          # Install dependencies
cp .env.example .env.local  # Set up environment (if .env.example exists)
bun dev              # Start dev server on port 3000
```

## Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Google AI Studio key for Gemini 2.x |
| `OPENROUTER_API_KEY` | No | OpenRouter key for free vision models |

## Build & Deploy
```bash
bun run build        # Build for production (standalone output)
bun start            # Run production build
bun run lint         # Run ESLint
```

## Key Files to Read First
1. `src/app/page.tsx` — Main app shell, understand the tab system
2. `src/lib/krishi-store.ts` — State management, understand data models
3. `src/lib/disease-db.ts` — Disease database structure
4. `src/app/globals.css` — All theme tokens and custom CSS
5. `src/lib/gemini.ts` — AI model cascade logic

## Common Tasks

### Add a New Crop to Disease Database
1. Add crop to `CROP_LIST` in `src/lib/disease-db.ts`
2. Add disease entries for that crop to `DISEASE_DB` array
3. Ensure `similarDiseases` IDs reference existing entries

### Add a New Tab
1. Create component in `src/components/krishi/NewTab.tsx`
2. Import and add to tab system in `src/app/page.tsx`
3. Add tab state to `src/lib/krishi-store.ts` if needed

### Add a New AI Provider
1. Add provider function in `src/app/api/chat/route.ts`
2. Insert into the cascade order (before or after existing tiers)
3. Return `{ response: text, source: 'provider_name' }`

### Modify Theme Colors
1. Edit `src/app/globals.css` → `@theme inline { ... }` block
2. Do NOT edit `tailwind.config.ts` (Tailwind v4 ignores it)
3. Use custom colors as `bg-krishi-green`, `text-krishi-amber`, etc.

### Add a New API Endpoint
1. Create `src/app/api/new-endpoint/route.ts`
2. Export async functions (`GET`, `POST`, etc.) with `NextRequest`/`NextResponse`
3. If deploying to Cloudflare Pages, also add to `functions/api/new-endpoint.js`

## Important Warnings

1. **Do NOT use `sonner` for toasts** — The layout only mounts the shadcn/ui Toaster. Use `import { toast } from '@/hooks/use-toast'`.
2. **Do NOT edit `tailwind.config.ts`** — It's dead code. Edit `globals.css` instead.
3. **Do NOT import from root `components/` or `services/`** — These are dead code from an earlier iteration.
4. **All user-facing text must be in Bengali** — This is a Bengali-first app.
5. **Keep AI calls server-side** — API keys must never reach the client.

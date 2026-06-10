# Architecture & File Structure

## Directory Layout

```
krishi-ai/
├── src/                          ← Active source code (ALL work happens here)
│   ├── app/
│   │   ├── page.tsx              ← Main app shell (tab orchestrator, splash screen, swipe nav)
│   │   ├── layout.tsx            ← Root layout (metadata, fonts, Toaster)
│   │   ├── globals.css           ← Tailwind v4 @theme inline (all design tokens)
│   │   └── api/
│   │       ├── chat/route.ts     ← 3-tier AI chat API (Gemini → OpenRouter → Rules)
│   │       ├── analyze/route.ts  ← Disease diagnosis API (local DB + Gemini Vision)
│   │       └── route.ts          ← Health check GET endpoint
│   ├── components/
│   │   ├── krishi/               ← 6 tab components (THE core UI)
│   │   │   ├── HomeTab.tsx       ← Dashboard: weather, prices, news
│   │   │   ├── ChatTab.tsx       ← AI chat with category chips
│   │   │   ├── AnalyzerTab.tsx   ← CABI-style disease diagnosis wizard
│   │   │   ├── ToolsTab.tsx      ← Agricultural tools hub
│   │   │   ├── LearnTab.tsx      ← Educational content + quiz
│   │   │   └── ProfileTab.tsx    ← Farmer profile (local storage)
│   │   ├── PwaInstallPrompt.tsx  ← PWA install banner
│   │   └── ui/                   ← 50+ shadcn/ui components (do not manually edit)
│   ├── lib/
│   │   ├── krishi-store.ts       ← Zustand store (tabs, chat, scans, profile)
│   │   ├── gemini.ts             ← Gemini API helper (model cascade, vision + chat)
│   │   ├── disease-db.ts         ← CABI Plantwise-style disease database (30+ entries)
│   │   └── utils.ts              ← cn() utility (clsx + tailwind-merge)
│   ├── hooks/
│   │   ├── use-pull-to-refresh.ts ← Touch-based pull-to-refresh
│   │   ├── use-mobile.ts         ← Mobile breakpoint detection
│   │   └── use-toast.ts          ← shadcn/ui toast system
│   └── services/
│       └── native-bridge.ts      ← Android WebView bridge (location, camera, storage)
├── public/
│   ├── manifest.json             ← PWA manifest
│   ├── sw.js                     ← Service worker
│   ├── icon-192.png              ← PWA icon (PNG)
│   ├── icon-192.svg / icon-512.svg ← PWA icons (SVG)
│   └── favicon.svg               ← Browser tab icon
├── functions/api/                ← Cloudflare Pages Functions (mirrors src/app/api/)
│   ├── analyze.js
│   └── chat.js
├── prisma/
│   └── schema.prisma             ← UNUSED — User/Post models (dead code)
├── data/
│   ├── cabi_training_images.csv  ← CABI training data reference
│   └── crop_diagnosis.csv        ← Crop diagnosis reference data
├── krishi-ai-backend/            ← Separate Python FastAPI (TTS service, not integrated)
├── docs/                         ← Deployment & status documentation
├── .agent-ctx/                   ← THIS FOLDER — Agent guide
├── next.config.ts                ← Next.js config (standalone output)
├── tailwind.config.ts            ← DEAD — Tailwind v4 ignores this file
├── tsconfig.json                 ← TypeScript config
├── eslint.config.mjs             ← ESLint config
└── package.json                  ← Dependencies & scripts
```

## Data Flow

### Chat Flow
```
User types message → ChatTab → POST /api/chat →
  ├─ callGeminiChat() [Tier 1] → Success → Return response
  ├─ callOpenRouter() [Tier 2] → Success → Return response
  └─ getRuleBasedResponse() [Tier 3] → Always returns Bengali advice
```

### Disease Diagnosis Flow
```
User selects Crop → Part → Symptom → [Optional: Photo] → POST /api/analyze →
  ├─ matchDiseases() [Local DB search] → localResults[]
  ├─ callAIVision() [If photo] → aiResults[]
  ├─ Combine + deduplicate → Boost confidence for dual matches
  └─ Return top 5 matches with CABI Green/Yellow treatment lists
```

### State Management
```
Zustand Store (krishi-store.ts):
  - activeTab: string          ← Current tab
  - chatMessages: ChatMessage[] ← Chat history
  - scanHistory: ScanResult[]  ← Last 20 disease scans
  - profile: FarmerProfile     ← Farmer name, district, crops, etc.
  - All persisted to localStorage
```

## Important Notes for Agents

1. **Tailwind v4**: The `tailwind.config.ts` file is DEAD. All theme tokens are defined in `src/app/globals.css` via `@theme inline { ... }`. Custom colors like `bg-krishi-green` are defined there.

2. **Toast System**: Uses shadcn/ui toast (`@/hooks/use-toast` + `@/components/ui/toaster`). Do NOT import from `sonner` — the Sonner Toaster is not mounted in the layout.

3. **API Keys**: Never exposed to the frontend. All AI calls go through server-side API routes (`/api/chat`, `/api/analyze`).

4. **Path Aliases**: `@/*` maps to `./src/*` (configured in tsconfig.json).

5. **The `components/` and `services/` root directories are DEAD CODE** from an earlier iteration. The active code is exclusively under `src/`.

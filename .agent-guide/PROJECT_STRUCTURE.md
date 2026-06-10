# Project Structure

## Directory Layout

```
krishi-ai/
├── .agent-guide/              # 📖 AI agent onboarding guide (this folder)
├── .archived-files-manifest   # Manifest of disabled/dead-code files
├── _disabled_components/      # 🚫 Legacy UI components (45 files, disabled)
├── _disabled_services/        # 🚫 Legacy services including Supabase (21 files, disabled)
├── _disabled_tests/           # 🚫 Legacy test files (5 files, disabled)
├── data/                      # Static data files
│   ├── cabi_training_images.csv  # CABI training image references
│   └── crop_diagnosis.csv        # Crop diagnosis data
├── docs/                      # Project documentation
│   ├── deployment/            # Deployment guides (Vercel, Cloudflare)
│   ├── status/                # Status reports and security docs
│   └── analyzer_update_instructions.md
├── krishi-ai-backend/         # Python FastAPI backend (TTS service)
│   ├── app/
│   │   ├── main.py           # FastAPI app entry
│   │   ├── routes/tts.py     # TTS endpoint
│   │   └── services/tts_service.py
│   ├── render.yaml           # Render deployment config
│   └── requirements.txt
├── prisma/                    # Prisma ORM
│   ├── schema.prisma         # Database schema (User, ScanResult, ChatMessage, etc.)
│   └── dev.db                # SQLite development database
├── public/                    # Static assets served as-is
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.svg
│   ├── logo.svg
│   └── robots.txt
├── src/                       # ✅ Active source code
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main app page (tab container)
│   │   ├── globals.css       # Global styles + Tailwind
│   │   └── api/              # API routes
│   │       ├── route.ts      # Health check / base API
│   │       ├── analyze/route.ts  # Crop image analysis endpoint
│   │       └── chat/route.ts     # AI chat endpoint
│   ├── components/            # React components
│   │   ├── krishi/           # App-specific tab components
│   │   │   ├── HomeTab.tsx   # Dashboard/home screen
│   │   │   ├── ChatTab.tsx   # AI chat interface
│   │   │   ├── AnalyzerTab.tsx # Crop image analyzer
│   │   │   ├── ToolsTab.tsx  # Agricultural tools
│   │   │   ├── LearnTab.tsx  # Educational content
│   │   │   └── ProfileTab.tsx # Farmer profile
│   │   ├── ui/               # shadcn/ui components (44 files)
│   │   └── PwaInstallPrompt.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.ts     # Mobile detection
│   │   ├── use-pull-to-refresh.ts
│   │   └── use-toast.ts
│   ├── lib/                   # Utility libraries
│   │   ├── utils.ts          # cn() helper and general utils
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── krishi-store.ts   # Zustand store (state management)
│   │   ├── disease-db.ts     # CABI-style disease database (30 entries)
│   │   └── gemini.ts         # Gemini API client utilities
│   └── services/              # Client-side services
│       └── native-bridge.ts  # Mobile native app bridge
├── .env                       # Environment variables (gitignored)
├── .env.example               # Template for environment variables
├── .gitignore
├── components.json            # shadcn/ui configuration
├── eslint.config.mjs
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json              # TypeScript configuration
├── vercel.json                # Vercel deployment config
├── Dockerfile                 # Docker production build
└── LICENSE
```

## Key File Descriptions

### Core Application Files

| File | Role | Notes |
|------|------|-------|
| `src/app/page.tsx` | Main app shell | Contains tab navigation, splash screen, swipe gestures |
| `src/app/layout.tsx` | Root layout | Fonts, metadata, global providers |
| `src/lib/krishi-store.ts` | Client state | Zustand store with localStorage persistence |
| `src/lib/disease-db.ts` | Disease data | 30 CABI-style disease entries with Green/Yellow lists |
| `src/lib/db.ts` | Database client | PrismaClient singleton (standard Next.js pattern) |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api` | GET | Health check endpoint |
| `/api/analyze` | POST | Crop image analysis (Gemini Vision + fallback) |
| `/api/chat` | POST | AI chat conversation (Gemini Chat) |

### Disabled Directories

| Directory | Original Name | Why Disabled |
|-----------|--------------|-------------|
| `_disabled_components/` | `components/` | 45 legacy React components from pre-Next.js migration |
| `_disabled_services/` | `services/` | 21 legacy service files, includes deprecated Supabase |
| `_disabled_tests/` | `tests/` | 5 test files referencing old project structure |

## Import Aliases

The `@/*` alias maps to `./src/*` (configured in `tsconfig.json`):
- `@/components/ui/button` → `src/components/ui/button.tsx`
- `@/lib/krishi-store` → `src/lib/krishi-store.ts`
- `@/hooks/use-mobile` → `src/hooks/use-mobile.ts`
- `@/services/native-bridge` → `src/services/native-bridge.ts`

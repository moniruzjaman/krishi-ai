# Architecture

## System Overview

Krishi AI is a mobile-first Progressive Web App (PWA) built for Bangladeshi farmers. It provides crop disease diagnosis, AI-powered chat assistance, agricultural tools, and educational content — all in Bengali (বাংলা).

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 16.x | Full-stack React framework |
| UI Library | React | 19.x | Component rendering |
| Language | TypeScript | 5.x | Type-safe development |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| UI Components | shadcn/ui (new-york) | Latest | Pre-built accessible components |
| Animation | framer-motion | 12.x | Smooth page transitions and gestures |
| State Management | Zustand | 5.x | Client-side state (chat, scans, profile) |
| Database ORM | Prisma | 6.x | Server-side data persistence (SQLite dev) |
| AI Model | Google Gemini | 2.5 Flash | Crop analysis & chat |
| Icons | Lucide React | Latest | Consistent icon system |
| Deployment | Vercel / Docker | - | Production hosting |

## Architecture Pattern

```
┌─────────────────────────────────────────────┐
│                   Client                     │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Pages   │  │ Zustand  │  │ LocalStore │  │
│  │ (React)  │←→│  Store   │←→│ (persist)  │  │
│  └────┬─────┘  └──────────┘  └────────────┘  │
│       │                                      │
│  ┌────▼─────────────────────────────────┐    │
│  │      shadcn/ui + Tailwind CSS        │    │
│  └──────────────────────────────────────┘    │
└───────────────────┬─────────────────────────┘
                    │ HTTP / API calls
┌───────────────────▼─────────────────────────┐
│              Next.js API Routes              │
│  ┌────────────┐  ┌─────────┐  ┌──────────┐  │
│  │ /api/      │  │/api/    │  │/api/     │  │
│  │ analyze    │  │ chat    │  │ route.ts │  │
│  └─────┬──────┘  └────┬────┘  └──────────┘  │
│        │              │                      │
│  ┌─────▼──────────────▼──────────────────┐   │
│  │     Gemini API (2.5 Flash)            │   │
│  │     + Rule-based fallback             │   │
│  └───────────────────────────────────────┘   │
│                                               │
│  ┌───────────────────────────────────────┐   │
│  │     Prisma Client → SQLite (dev)      │   │
│  │     (User, ScanResult, ChatMessage,   │   │
│  │      FarmerProfile, DiseaseReport)    │   │
│  └───────────────────────────────────────┘   │
└───────────────────────────────────────────────┘
```

## Data Flow

### Crop Analysis Flow
1. User captures/uploads a crop image on the **AnalyzerTab**
2. Image is sent as base64 to `POST /api/analyze`
3. The API route sends the image to Gemini Vision API
4. If Gemini fails, falls back to rule-based analysis using `DISEASE_DB`
5. Results are stored in Zustand store and optionally in Prisma DB
6. Diagnosis is displayed with CABI-style Green/Yellow lists

### Chat Flow
1. User sends a message on the **ChatTab**
2. Message is sent to `POST /api/chat`
3. The API route forwards to Gemini Chat API with agricultural context
4. Response is streamed back to the client
5. Chat history is stored in Zustand/localStorage

### State Persistence
- **Client-side:** Zustand store with localStorage hydration
  - Chat messages (`krishi-chat`)
  - Scan history (`krishi-scans`)
  - Farmer profile (`krishi-profile`)
- **Server-side:** Prisma + SQLite
  - User accounts
  - Persistent scan results
  - Chat message logs
  - Farmer profiles
  - Disease reports

## PWA Features
- Service worker (`/public/sw.js`) for offline caching
- Web app manifest (`/public/manifest.json`)
- Install prompt component (`PwaInstallPrompt`)
- Native bridge for mobile app integration

## Mobile UX Features
- Swipe gesture navigation between tabs (framer-motion)
- Pull-to-refresh on main content area
- Status bar and app bar (native-like)
- Bottom navigation bar
- Safe area handling for notched devices

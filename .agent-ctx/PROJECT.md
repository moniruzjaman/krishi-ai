# Krishi AI — Project Overview

> কৃষি এআই (Krishi AI) — Bengali-first Agricultural AI Assistant for Bangladeshi Farmers

## What Is This?

Krishi AI is a **mobile-first Progressive Web App (PWA)** that provides AI-powered crop disease diagnosis, agricultural advice, market prices, and weather information to Bengali-speaking farmers in Bangladesh. The entire UI is in Bengali (বাংলা).

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x (v4 `@theme inline` in globals.css) |
| UI Components | shadcn/ui | Latest |
| State Management | Zustand + localStorage | 5.x |
| Animations | Framer Motion | 12.x |
| AI - Primary | Google Gemini (2.5 Flash → 2.0 Flash cascade) | Free tier |
| AI - Fallback | OpenRouter (Gemma-3, Llama-4, Mistral free models) | Free tier |
| AI - Offline | Rule-based Bengali keyword matching | Zero cost |
| Package Manager | Bun | 1.x |
| Deployment | Vercel (primary) + Cloudflare Pages (secondary) | — |
| PWA | Service Worker + manifest.json | Standalone |

## Core Architecture

### 3-Tier AI Cascade (Always Works)

```
User Query → Tier 1: Gemini 2.5 Flash (free, best quality)
           → Tier 2: OpenRouter free models (fallback)
           → Tier 3: Rule-based Bengali keywords (offline, zero cost)
```

Even without any API keys, the app provides Bengali agricultural advice via Tier 3.

### Disease Diagnosis Flow (CABI PlantwisePlus-style)

```
1. Select Crop (ধান, গম, পাট, আলু, সরিষা, পেঁয়াজ, ভুট্টা, ...)
2. Select Plant Part (পাতা, কাণ্ড, ফল, শিকড়, পুরো গাছ, বীজ)
3. Select Symptom (রঙ পরিবর্তন, দাগ, পচন, শুকানো, বিকৃতি, পোকার ক্ষত, বৃদ্ধি বাধা)
4. Optional: Upload/capture photo → Gemini 2.5 Vision analysis
5. Results: matched diseases with Green List (organic) / Yellow List (chemical) treatments
```

## Key Constraints

- **Bengali-first**: All user-facing text is in Bengali. System prompts to AI are in Bengali.
- **Free tier only**: All AI models used are on free tiers. No paid API calls.
- **Offline-capable**: Rule-based tier works without any API. PWA caches critical assets.
- **Mobile-first**: Designed for Android WebView and mobile browsers. Touch-optimized.
- **No database required**: All data persisted in localStorage via Zustand. Prisma schema exists but is unused.

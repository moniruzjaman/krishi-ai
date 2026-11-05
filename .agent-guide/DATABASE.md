# Data Storage Guide

## Overview

**There is no database.** All user data is persisted in the browser via
`localStorage`, managed by the Zustand store in `src/lib/krishi-store.ts`.

> **Historical note:** The project briefly used Prisma 6 + SQLite
> (`prisma/schema.prisma` + `src/lib/db.ts`). It was never imported by any
> application code, and SQLite is not runtime-compatible with the Cloudflare
> Workers deployment target (the primary deploy via OpenNext). Both were
> removed on 2026-11-06. See `.agent-guide/CHANGELOG_AGENT.md`.

## Why localStorage

- **Zero infrastructure** — no database to provision, migrate, or pay for.
- **Offline-first** — data is available without a network round-trip.
- **Privacy** — the farmer's profile, chat history, and scan results never
  leave the device unless the user explicitly turns on Cloud Sync.
- **Consistent with the deployment targets** — Cloudflare Workers have no
  persistent filesystem, and Prisma/SQLite would not work there.

## Storage keys

| Key | Written by | Contents |
|-----|-----------|----------|
| `krishi-chat` | `krishi-store.ts` | `ChatMessage[]` — chat history |
| `krishi-scans` | `krishi-store.ts` | `ScanResult[]` — last 20 diagnosis results |
| `krishi-profile` | `krishi-store.ts` | `FarmerProfile` — name, district, crops, farm size, experience, phone |
| `krishi:analytics-url` | `src/lib/analytics.ts` | Plausible-compatible endpoint URL |
| `krishi:analytics-on` | `src/lib/analytics.ts` | `'1'` when the user opts in |
| `krishi:weather-alerts` | `src/lib/weather-alerts.ts` | `WeatherAlert[]` — cached severe-weather alerts |
| `krishi:weather-last-check` | `src/lib/weather-alerts.ts` | Timestamp of the last weather check |
| `krishi_chat_history` | legacy Vite app | superseded by `krishi-chat` |

## Reading localStorage in React

LocalStorage is client-only, so a plain `useState` + `useEffect` read causes a
hydration mismatch and trips the `react-hooks/set-state-in-effect` ESLint rule.
Use `useSyncExternalStore` instead:

```ts
// src/lib/analytics.ts
export function subscribeAnalytics(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}
```

```tsx
const analyticsOn = useSyncExternalStore(
  subscribeAnalytics,
  isAnalyticsEnabled,
  () => false   // server snapshot
)
```

## Clearing data

Profile → "ডেটা মুছুন" (Delete data) clears the store-managed keys. The
analytics and weather-alert keys are independent and can be cleared from the
Profile settings / bell sheet.

## If a real database is ever needed

Recommended path: **Cloudflare D1** (already in the Workers runtime, free tier
included) accessed through a thin API route, or **PocketBase** (single Go
binary, MIT) for a self-hosted option. Keep the `krishi-store.ts` interface
stable so the swap is contained to one module.

Do **not** reintroduce SQLite Prisma — it does not run on Workers.

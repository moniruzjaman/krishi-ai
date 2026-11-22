# Respiratory Tools — Live URL Registry

> Module: `src/lib/respiratory-tools.ts` · UI: `ToolsTab → শ্বাসযন্ত্র টুলস (respiratory)`

## Context

The Krishi AI app itself is deployed on **all** requested platforms, from one GitHub repo
(`github.com/moniruzjaman/krishi-ai`):

| Platform | Live URL | Status (verified 2026-11-23) |
|---|---|---|
| Custom domain (KrishiAI) | https://krishiai.live | ✅ DNS + Vercel edge active (SSO-gated to non-members; GitHub repo `homepage` field points here) |
| Cloudflare Pages | https://krishi-ai.pages.dev | ✅ HTTP 200 |
| Vercel | project `krishiai` (team `krishi-ai-team`, linked via `.vercel/project.json`) | ✅ auto-deploy on push to `main` |
| GitHub Pages | — | ❌ not enabled for this repo (Next.js PWA needs serverless `/api/*`, so Pages is not a suitable target) |

## Respiratory tool repos & their live URLs

Each entry links a **GitHub repo** to its **live URL**, covering the mentioned hosting platforms:

| Tool | Repo | Live URL | Platform | Verified |
|---|---|---|---|---|
| RRest (respiratory rate algorithms) | `peterhcharlton/RRest` | https://peterhcharlton.github.io/RRest/ | GitHub Pages | ✅ 200 |
| OpenVentilator (open-source ventilator) | `popsolutions/openventilator` | https://openventilator.io | Custom Domain | ✅ 200 |
| VitalLens (vital signs / resp. rate API) | `Rouast-Labs/vitallens-python` | https://www.rouast.com/api/ | Custom Domain | ✅ 200 |

## Modular design

- **Data layer**: `src/lib/respiratory-tools.ts` — typed registry (`RespiratoryTool[]`). Add/remove tools here only.
- **UI layer**: `src/components/krishi/ToolsTab.tsx` — renders the registry generically; zero hard-coded tool data.
- **State layer**: existing Zustand `toolsSubPage` in `src/lib/krishi-store.ts` — no store changes needed (`toolsSubPage: string | null` accepts the new `'respiratory'` id).
- All external links use `target="_blank" rel="noopener noreferrer"`.

## Note on scope

Krishi AI is an agricultural assistant; "respiratory" here refers to plant respiration /
stress symptoms (leaf drying, wilting) covered by Plant Health & Pesticide tools, plus a
curated gateway to vetted open-source respiratory-health measurement tools above.

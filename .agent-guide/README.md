# Krishi AI — Agent Guide

> **Purpose:** This directory serves as a comprehensive onboarding guide for any AI agent (or developer) interacting with the Krishi AI project. It contains architectural documentation, coding standards, project structure guides, and operational runbooks.

## Contents

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, data flow, and technology stack |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Complete directory structure and file organization |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | Code style, naming conventions, and best practices |
| [DATABASE.md](./DATABASE.md) | Prisma schema, database operations, and migration guide |
| [API_REFERENCE.md](./API_REFERENCE.md) | API routes, request/response formats, and error handling |
| [COMPONENTS.md](./COMPONENTS.md) | UI component organization and usage patterns |
| [DISABLED_MODULES.md](./DISABLED_MODULES.md) | Inventory of disabled modules and how to re-enable them |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues, fixes, and debugging guide |
| [CHANGELOG_AGENT.md](./CHANGELOG_AGENT.md) | Log of agent-driven changes to the codebase |

## Quick Start for Agents

1. **Read this file** to understand the project layout
2. **Read ARCHITECTURE.md** to understand the system design
3. **Read DATABASE.md** before making any data-layer changes
4. **Read DISABLED_MODULES.md** before re-enabling any disabled code
5. **Follow CODING_STANDARDS.md** when writing any new code

## Key Facts

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode, no implicit any disabled)
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style)
- **Database:** Prisma 6 with SQLite (dev) — switchable to PostgreSQL/MySQL
- **State Management:** Zustand (client-side) + Prisma (server-side)
- **AI Provider:** Google Gemini (Vision + Chat) via API routes
- **Package Manager:** Bun (bun.lock present)
- **Deployment:** Vercel (primary), Docker (standalone output)

## Supabase → Prisma Migration

This project was migrated from Supabase to Prisma on **2026-06-10**. All Supabase references have been disabled (not deleted). See [DISABLED_MODULES.md](./DISABLED_MODULES.md) for details.

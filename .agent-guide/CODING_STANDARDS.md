# Coding Standards

## General Principles

- **Language:** TypeScript (strict mode enabled, `noImplicitAny: false`)
- **Framework:** Next.js 16 App Router — use Server Components by default, Client Components only when needed
- **Styling:** Tailwind CSS v4 utility classes — avoid custom CSS unless necessary
- **Components:** shadcn/ui (new-york style) — extend before creating from scratch

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase.tsx | `HomeTab.tsx`, `ChatTab.tsx` |
| Utility files | kebab-case.ts | `krishi-store.ts`, `disease-db.ts` |
| API routes | route.ts (in directory) | `api/analyze/route.ts` |
| Hooks | use-kebab-case.ts | `use-pull-to-refresh.ts` |
| CSS | globals.css (single file) | `globals.css` |

## Component Structure

```tsx
'use client'  // Only when needed (useState, useEffect, event handlers)

import { external } from 'package'
import { internal } from '@/lib/...'
import { Component } from '@/components/...'

// Types at the top
interface MyProps {
  title: string
  count?: number
}

// Constants next
const DEFAULT_VALUE = 42

// Component
export default function MyComponent({ title, count = 0 }: MyProps) {
  // Hooks
  const [state, setState] = useState(false)

  // Effects
  useEffect(() => { /* ... */ }, [])

  // Handlers
  const handleClick = () => { /* ... */ }

  // Render
  return (
    <div className="tailwind-classes">
      {/* ... */}
    </div>
  )
}
```

## State Management Rules

1. **Client-side state:** Use Zustand store (`src/lib/krishi-store.ts`)
   - Chat messages, scan results, farmer profile, UI state
   - Automatically persisted to localStorage

2. **Server-side state:** Use Prisma (`src/lib/db.ts`)
   - User accounts, persistent records, reports
   - Access via `db` export from `@/lib/db`

3. **Do NOT mix:** Don't use Prisma in client components, don't use Zustand in API routes

## Styling Rules

1. Use Tailwind utility classes exclusively
2. Custom CSS only in `globals.css` (for app-wide styles like `.bottom-nav`)
3. Use CSS custom properties for theming (already defined in globals.css)
4. Mobile-first: design for 375px width, scale up

### Color System (CSS Variables)

```
--krishi-green: #2E7D32     (primary green)
--krishi-amber: #F57F17     (amber/gold)
--krishi-sky: #0288D1       (sky blue)
--krishi-red: #C62828       (danger red)
--krishi-earth: #5D4037     (earth brown)
```

## framer-motion Guidelines

When using framer-motion, always use `as const` for transition and variant objects to satisfy TypeScript:

```tsx
// ✅ Correct — use 'as const' for literal types
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, ease: 'easeOut' as const }
  })
}

// ✅ Correct — use 'as const' for type literals in transitions
const transition = {
  x: { type: 'spring' as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
}
```

## API Route Patterns

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // ... process
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error message' },
      { status: 500 }
    )
  }
}
```

## Bengali (বাংলা) Content

- All user-facing text must be in Bengali
- Use Bengali numerals (০১২৩৪৫৬৭৮৯) for displayed numbers
- Keep technical identifiers (disease IDs, API params) in English
- Store both `nameBn` and `nameEn` for disease entries

## Disabled Code Rules

- **Never delete** code that might be useful later — rename directories with `_disabled_` prefix
- Add a `README.md` inside each disabled directory explaining what it contains and how to re-enable
- Update `.gitignore` and `tsconfig.json` exclude list when disabling directories
- Update `.archived-files-manifest` to track disabled files

## Prisma Rules

1. Always use the singleton from `@/lib/db`: `import { db } from '@/lib/db'`
2. After schema changes, run: `npx prisma generate && npx prisma db push`
3. Use SQLite for development (`DATABASE_URL="file:./dev.db"`)
4. For production, switch to PostgreSQL by changing the provider and URL
5. Store JSON arrays as `String` type in SQLite (no native JSON support)

## Import Organization

Organize imports in this order:
1. React / Next.js
2. Third-party packages (framer-motion, lucide-react, etc.)
3. Internal utilities (`@/lib/...`)
4. Internal components (`@/components/...`)
5. Internal hooks (`@/hooks/...`)
6. Internal services (`@/services/...`)

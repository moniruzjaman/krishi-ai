# Conventions & Patterns

## Code Style

### Naming
- Components: PascalCase (`ChatTab.tsx`, `AnalyzerTab.tsx`)
- Utilities/hooks: camelCase (`use-mobile.ts`, `krishi-store.ts`)
- API routes: kebab-case in directory names (`api/chat/route.ts`, `api/analyze/route.ts`)
- CSS classes: kebab-case with Tailwind (`bg-krishi-green`, `chat-bubble-assistant`)
- Zustand store: camelCase with `use` prefix (`useKrishiStore`)
- Types: PascalCase (`ChatMessage`, `ScanResult`, `DiseaseEntry`)

### File Organization
- One component per file, default export
- Shared types exported from the file that "owns" them
- shadcn/ui components in `src/components/ui/` — do NOT manually edit these
- Custom components in `src/components/krishi/`
- Business logic in `src/lib/`

### Component Pattern
```tsx
'use client'  // Required for all interactive components

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SomeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useKrishiStore } from '@/lib/krishi-store'

export default function MyComponent() {
  // 1. Hooks at the top
  const { someState, someAction } = useKrishiStore()
  const [localState, setLocalState] = useState('')

  // 2. Callbacks with useCallback
  const handleClick = useCallback(() => { ... }, [deps])

  // 3. Effects
  useEffect(() => { ... }, [deps])

  // 4. Render
  return (
    <div className="page-content p-4 space-y-4 custom-scroll">
      {/* ... */}
    </div>
  )
}
```

### State Management Pattern
```tsx
// In krishi-store.ts
interface KrishiState {
  someField: string
  someAction: (value: string) => void
}

// In components
const { someField, someAction } = useKrishiStore()
```

### API Route Pattern
```tsx
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Validate input
    if (!body.required) {
      return NextResponse.json({ error: 'Required field missing' }, { status: 400 })
    }
    // Process
    const result = await doSomething(body)
    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

## Design Tokens (Tailwind v4)

All custom colors are in `src/app/globals.css`:

```css
@theme inline {
  --color-krishi-green: #1B5E20;        /* Primary green */
  --color-krishi-green-dark: #0D3B0E;   /* Darker green */
  --color-krishi-green-light: #4CAF50;  /* Lighter green */
  --color-krishi-amber: #E65100;        /* Warning/highlight */
  --color-krishi-sky: #0288D1;          /* Info/blue */
  --color-krishi-red: #C62828;          /* Error/critical */
  /* ... */
}
```

Use them as: `bg-krishi-green`, `text-krishi-amber`, `border-krishi-sky`

## Bengali Text Rules

- All user-facing text MUST be in Bengali (বাংলা)
- AI system prompts are in Bengali
- Technical terms can stay in English (e.g., "Gemini 2.5 Flash", "CABI Plantwise")
- Error messages in Bengali
- Category labels in Bengali
- Comments in code can be in English or Bengali

## Testing Strategy

- No formal test suite currently
- The `tests/` directory contains legacy test files from an earlier iteration
- Manual testing via `bun dev`

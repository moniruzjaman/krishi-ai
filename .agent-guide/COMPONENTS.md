# Components Guide

## Component Organization

```
src/components/
├── krishi/              # App-specific tab components
│   ├── HomeTab.tsx      # Main dashboard screen
│   ├── ChatTab.tsx      # AI chat interface
│   ├── AnalyzerTab.tsx  # Crop disease analyzer
│   ├── ToolsTab.tsx     # Agricultural tools
│   ├── LearnTab.tsx     # Educational content
│   └── ProfileTab.tsx   # Farmer profile editor
├── ui/                  # shadcn/ui components (44 files)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── ... (full shadcn/ui set)
│   └── BottomSheet.tsx  # Custom bottom sheet component
└── PwaInstallPrompt.tsx # PWA install prompt banner
```

## App Tab Components

### HomeTab
- **Purpose:** Dashboard with weather, market prices, stats, news, testimonials
- **Key features:** Bengali date display, animated cards with fadeUp variants, progress bars
- **State:** Reads from `useKrishiStore` for navigation
- **External data:** Static mock data (weather, prices, news)

### ChatTab
- **Purpose:** AI-powered agricultural chatbot
- **Key features:** Message input, chat history, auto-scroll, typing indicator
- **State:** `useKrishiStore` for chat messages and loading state
- **API:** Calls `POST /api/chat`

### AnalyzerTab
- **Purpose:** Crop image analysis and disease diagnosis
- **Key features:** Camera/gallery upload, image preview, CABI-style diagnosis results
- **State:** `useKrishiStore` for scan results and analyzing state
- **API:** Calls `POST /api/analyze`
- **Data:** Uses `DISEASE_DB`, `CROP_LIST`, `PLANT_PARTS`, `SYMPTOM_TYPES` from `disease-db.ts`

### ToolsTab
- **Purpose:** Agricultural tools hub (weather, market prices, soil guide, etc.)
- **Key features:** Grid of tool cards, navigation to sub-pages
- **State:** `useKrishiStore` for toolsSubPage

### LearnTab
- **Purpose:** Educational content (disease library, guides, flashcards)
- **Key features:** Search, category filtering, content cards
- **Data:** Uses `DISEASE_DB` for disease information

### ProfileTab
- **Purpose:** Farmer profile management
- **Key features:** Edit name, district, crops, farm size, experience
- **State:** `useKrishiStore` for farmer profile

## UI Component Library (shadcn/ui)

All 44 shadcn/ui components are installed with the "new-york" style variant. Common ones used:

| Component | Usage |
|-----------|-------|
| `Button` | Primary actions, navigation |
| `Card` | Content containers |
| `Dialog` | Modal overlays |
| `Sheet` | Side panels |
| `Tabs` | Content switching |
| `Toast` | Notification messages |
| `Progress` | Loading/completion bars |
| `Avatar` | User/farmer avatars |
| `Input` | Form fields |
| `Textarea` | Multi-line text input |
| `Select` | Dropdown selections |
| `BottomSheet` | Mobile bottom drawer |

### Adding New shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Configuration is in `components.json`:
- Style: new-york
- RSC: enabled
- CSS: src/app/globals.css
- Aliases: `@/components/ui/*`

## Animation Pattern

Use framer-motion with the `fadeUp` pattern for consistent animations:

```tsx
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' as const }
  })
}

// Usage
<motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible">
  {/* content */}
</motion.div>
```

## Responsive Design

- **Mobile-first:** Primary target is 375px width
- **Max width:** `max-w-lg mx-auto` constrains to phone-like width on desktop
- **Touch targets:** Minimum 44px tap targets
- **Safe areas:** `safe-top`, `safe-bottom` classes for notched devices

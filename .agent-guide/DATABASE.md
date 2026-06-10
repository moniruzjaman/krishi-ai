# Database Guide (Prisma)

## Overview

The project uses **Prisma 6** as its ORM with **SQLite** for development. The database schema is defined in `prisma/schema.prisma` and the Prisma client singleton is exported from `src/lib/db.ts`.

## Schema Models

### User
Stores user account information.
| Field | Type | Notes |
|-------|------|-------|
| id | String (@id, cuid) | Primary key |
| email | String (@unique) | User email |
| name | String? | Display name |
| phone | String? | Phone number |
| district | String? | Bangladesh district |
| role | String | Default: "farmer" (farmer, expert, admin) |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Auto-updated |

### FarmerProfile
Extended profile linked to User (1:1).
| Field | Type | Notes |
|-------|------|-------|
| id | String (@id, cuid) | Primary key |
| userId | String (@unique) | FK → User.id |
| name | String | Farmer name |
| district | String | Default: "ঢাকা" |
| crops | String | JSON array as string, e.g. '["ধান","গম"]' |
| farmSize | String | Default: "1-5 একর" |
| experience | String | Default: "5-10 বছর" |
| phone | String | Default: "" |

### ScanResult
Crop disease scan/analysis results.
| Field | Type | Notes |
|-------|------|-------|
| id | String (@id, cuid) | Primary key |
| userId | String? | FK → User.id (nullable) |
| imageUrl | String | URL or base64 reference |
| diagnosis | String | Disease name |
| disease | String | Disease ID from DISEASE_DB |
| severity | String | low, medium, high, critical |
| confidence | Float | 0.0 - 1.0 |
| treatment | String | Treatment recommendation |
| cropId | String? | Crop identifier |
| plantPart | String? | leaf, stem, fruit, root, whole, seed |
| causalType | String? | fungus, bacteria, virus, pest, nematode, abiotic |
| diagnosisMethod | String? | ai, rule_based, manual |

### ChatMessage
AI chat conversation records.
| Field | Type | Notes |
|-------|------|-------|
| id | String (@id, cuid) | Primary key |
| userId | String? | FK → User.id (nullable) |
| role | String | "user" or "assistant" |
| content | String | Message content |
| category | String? | Optional topic category |

### DiseaseReport
Aggregated disease analysis reports.
| Field | Type | Notes |
|-------|------|-------|
| id | String (@id, cuid) | Primary key |
| diseaseId | String | References DISEASE_DB id |
| diseaseNameBn | String | Bengali name |
| diseaseNameEn | String | English name |
| causalType | String | Type of causative agent |
| causalOrganism | String | Scientific name |
| affectedCrops | String | JSON array |
| affectedParts | String | JSON array |
| symptoms | String | JSON array |
| severity | String | Severity level |
| greenList | String | JSON array — organic controls |
| yellowList | String | JSON array — chemical controls |
| prevention | String | JSON array |
| similarDiseases | String | JSON array of disease IDs |
| spreadMethod | String | How the disease spreads |
| favorableConditions | String | Conditions that promote disease |
| districts | String | JSON array — Bangladesh districts |
| seasonality | String | When it typically occurs |
| scanCount | Int | Number of times diagnosed |

## Common Operations

### Using the Prisma Client

```typescript
import { db } from '@/lib/db'

// Create a user
const user = await db.user.create({
  data: { email: 'farmer@example.com', name: 'রহিম' }
})

// Save a scan result
const scan = await db.scanResult.create({
  data: {
    imageUrl: 'data:image/png;base64,...',
    diagnosis: 'Rice Blast',
    disease: 'rice_blast',
    severity: 'high',
    confidence: 0.92,
    treatment: 'ট্রাইসাইক্লাজোল ৭৫ WP @ ০.৬ গ্রাম/লিটার',
    cropId: 'rice',
    plantPart: 'leaf',
    causalType: 'fungus',
    diagnosisMethod: 'ai',
  }
})

// Get user's scan history
const history = await db.scanResult.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
  take: 20,
})

// Save a chat message
const message = await db.chatMessage.create({
  data: {
    userId: user.id,
    role: 'user',
    content: 'আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে',
  }
})
```

### Schema Changes Workflow

```bash
# 1. Edit prisma/schema.prisma
# 2. Generate the client
npx prisma generate

# 3. Push changes to the database (dev)
npx prisma db push

# 4. For production, use migrations
npx prisma migrate dev --name your_migration_name
```

### Switching to PostgreSQL

1. Change `provider` in `schema.prisma` from `"sqlite"` to `"postgresql"`
2. Change `DATABASE_URL` to a PostgreSQL connection string
3. JSON string fields can be replaced with native `Json` type
4. Run `npx prisma migrate dev` to create migration

## Migration History

| Date | Change | Agent |
|------|--------|-------|
| 2026-06-10 | Supabase → Prisma migration. Created schema with User, FarmerProfile, ScanResult, ChatMessage, DiseaseReport models. SQLite dev database. | AI Agent |

## Supabase → Prisma Mapping

The following Supabase operations now map to Prisma:

| Supabase (disabled) | Prisma (active) |
|--------------------|-----------------|
| `supabase.from('users').insert()` | `db.user.create()` |
| `supabase.from('reports').insert()` | `db.scanResult.create()` |
| `supabase.from('reports').select()` | `db.scanResult.findMany()` |
| `supabase.storage.upload()` | Not yet migrated — use file system or cloud storage SDK |
| `supabase.storage.getPublicUrl()` | Not yet migrated — store URLs in `imageUrl` field |

## Notes

- The `db` singleton uses the standard Next.js pattern to prevent multiple PrismaClient instances during hot reload
- JSON arrays are stored as strings in SQLite due to lack of native JSON support — parse/stringify manually
- The database file (`prisma/dev.db`) is gitignored and must be created with `npx prisma db push`

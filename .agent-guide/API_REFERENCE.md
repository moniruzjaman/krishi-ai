# API Reference

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://krishiai.live` (or Vercel deployment URL)

## Endpoints

### GET /api

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "0.2.0"
}
```

---

### POST /api/analyze

Analyze a crop image for disease diagnosis.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "cropId": "rice",
  "plantPart": "leaf",
  "symptoms": ["discolor", "spots"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | string | Yes | Base64-encoded image data (data URI) |
| cropId | string | No | Crop identifier from CROP_LIST |
| plantPart | string | No | Plant part from PLANT_PARTS |
| symptoms | string[] | No | Symptom type IDs from SYMPTOM_TYPES |

**Response (Success):**
```json
{
  "success": true,
  "diagnosis": {
    "disease": "rice_blast",
    "diseaseNameBn": "ব্লাস্ট রোগ",
    "diseaseNameEn": "Rice Blast",
    "causalType": "fungus",
    "causalOrganism": "Magnaporthe oryzae",
    "severity": "high",
    "confidence": 0.92,
    "description": "ধানের সবচেয়ে ধ্বংসাত্মক ছত্রাকজনিত রোগ...",
    "greenList": ["প্রতিরোধী জাত ব্যবহার করুন...", "..."],
    "yellowList": ["ট্রাইসাইক্লাজোল ৭৫ WP @ ০.৬ গ্রাম/লিটার...", "..."],
    "prevention": ["প্রতিরোধী জাত নির্বাচন", "..."],
    "similarDiseases": ["brown_spot", "leaf_scald", "bacterial_leaf_blight"],
    "spreadMethod": "বাতাসের মাধ্যমে স্পোর ছড়ায়...",
    "favorableConditions": "আর্দ্রতা ৮৯%+...",
    "districts": ["দিনাজপুর", "রংপুর", "..."],
    "seasonality": "ভাদ্র-আশ্বিন (আউশ ধান)..."
  },
  "method": "ai"
}
```

**Response (Fallback to rule-based):**
```json
{
  "success": true,
  "diagnosis": { "...same format..." },
  "method": "rule_based",
  "fallback": true
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "No image data provided"
}
```

**Diagnosis Methods:**
- `ai` — Gemini Vision API analysis (primary)
- `rule_based` — Fallback using DISEASE_DB matching (when AI unavailable)
- `manual` — Manual expert entry (future)

---

### POST /api/chat

Send a message to the AI chat assistant.

**Request:**
```json
{
  "message": "আমার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে, কী করব?",
  "history": [
    { "role": "user", "content": "পূর্ববর্তী বার্তা" },
    { "role": "assistant", "content": "পূর্ববর্তী উত্তর" }
  ],
  "language": "bn"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | User's chat message (typically in Bengali) |
| history | object[] | No | Previous conversation for context |
| language | string | No | Language code (default: "bn") |

**Response:**
```json
{
  "response": "আপনার ধানের পাতায় বাদামি দাগ দেখা যাচ্ছে, এটি ব্লাস্ট রোগ বা বাদামি গাঁজ রোগ হতে পারে...",
  "model": "gemini-2.5-flash"
}
```

**Response (Error):**
```json
{
  "error": "Failed to get AI response",
  "fallback": "আমি এই মুহূর্তে উত্তর দিতে পারছি না। পরে আবার চেষ্টা করুন।"
}
```

## Error Handling

All API routes follow this error pattern:

```typescript
try {
  // ... processing
} catch (error) {
  console.error('Error description:', error)
  return NextResponse.json(
    { error: 'Human-readable error message' },
    { status: 500 }
  )
}
```

## Rate Limiting

- Currently no rate limiting is implemented
- Gemini API has its own rate limits (depend on API key tier)
- Consider adding rate limiting for production deployment

## Environment Variables Required

| Variable | Used By | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Prisma | SQLite or PostgreSQL connection string |
| `GEMINI_API_KEY` | /api/analyze, /api/chat | Google Gemini API key |
| `OPENROUTER_API_KEY` | /api/chat (fallback) | OpenRouter API key (optional) |

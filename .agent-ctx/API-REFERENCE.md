# API Reference

## POST /api/chat

3-tier AI chat endpoint for agricultural questions.

### Request
```json
{
  "message": "ধানে ব্লাস্ট রোগ হলে কী করব?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Response
```json
{
  "response": "ব্লাস্ট রোগ দমনে...",
  "source": "gemini",
  "model": "gemini-2.5-flash"
}
```

**source** values: `"gemini"` | `"openrouter"` | `"rules"`

### Validation
- `message` is required, must be string, max 5000 chars
- `history` is optional, last 10 messages used for context

### Cascade Logic
1. Try Gemini 2.5 Flash → 2.5 Flash Preview → 2.0 Flash
2. Try OpenRouter: Gemma-3 → Llama-4 → Mistral (free models)
3. Fall back to Bengali keyword matching rules

---

## POST /api/analyze

CABI PlantwisePlus-style disease diagnosis endpoint.

### Request
```json
{
  "cropId": "rice",
  "plantPart": "leaf",
  "symptomId": "spots",
  "image": "base64-encoded-string",
  "mimeType": "image/jpeg"
}
```

**Fields:**
- `cropId` (string): Crop identifier from CROP_LIST
- `plantPart` (string): Plant part from PLANT_PARTS
- `symptomId` (string): Symptom type from SYMPTOM_TYPES
- `image` (string, optional): Base64-encoded image for AI Vision analysis
- `mimeType` (string, optional): MIME type of the image

### Response
```json
{
  "matchedDiseases": [
    {
      "id": "rice_blast",
      "nameBn": "ব্লাস্ট রোগ",
      "nameEn": "Rice Blast",
      "causalType": "fungus",
      "causalOrganism": "Magnaporthe oryzae",
      "severity": "high",
      "confidence": 85,
      "description": "...",
      "symptoms": ["..."],
      "greenList": ["..."],
      "yellowList": ["..."],
      "prevention": ["..."],
      "similarDiseases": [{ "id": "...", "nameBn": "...", "nameEn": "...", "causalType": "..." }],
      "spreadMethod": "...",
      "favorableConditions": "...",
      "districts": ["..."],
      "seasonality": "...",
      "affectedParts": ["leaf", "stem"],
      "isBiotic": true
    }
  ],
  "totalMatches": 3,
  "diagnosisMethod": "combined",
  "cropId": "rice",
  "plantPart": "leaf",
  "symptomId": "spots",
  "advisoryNote": "..."
}
```

**diagnosisMethod** values:
- `"symptom_matching"` — Local DB only
- `"ai_vision"` — Gemini Vision only (not currently returned alone)
- `"combined"` — Local DB + Gemini Vision (dual confirmation, confidence boosted +10)

### Error Response
```json
{
  "matchedDiseases": [{ "id": "error", "nameBn": "বিশ্লেষণ ত্রুটি", ... }],
  "totalMatches": 1,
  "diagnosisMethod": "symptom_matching",
  "advisoryNote": "বিশ্লেষণে সমস্যা হয়েছে..."
}
```

---

## GET /api

Health check endpoint. Returns `{ status: "ok" }`.

---

## Local Functions (Not API Routes)

### `matchDiseases(cropId, plantPart, symptomId)` — `src/lib/disease-db.ts`
Returns matching DiseaseEntry[] from local database based on crop, plant part, and symptom keywords.

### `calculateConfidence(entry, cropId, plantPart, symptomId)` — `src/lib/disease-db.ts`
Returns a confidence score (0-100) based on how many criteria match.

### `getDiseaseById(id)` — `src/lib/disease-db.ts`
Returns a DiseaseEntry or undefined.

### `getSimilarDiseases(id)` — `src/lib/disease-db.ts`
Returns DiseaseEntry[] for all similar disease IDs.

### `callGeminiChat(apiKey, messages, systemPrompt?, options?)` — `src/lib/gemini.ts`
Calls Gemini with model cascade: 2.5 Flash → 2.5 Flash Preview → 2.0 Flash.

### `callGeminiVision(apiKey, image, prompt, options?)` — `src/lib/gemini.ts`
Calls Gemini Vision with model cascade for image analysis.

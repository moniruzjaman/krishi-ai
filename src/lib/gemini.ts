/**
 * Gemini AI Helper — Model Cascade for Free Tier
 *
 * Strategy: Try the latest free model first, then fall back to older models.
 * All models below are available on Google AI Studio free tier.
 *
 * Vision (image analysis):
 *   1. gemini-2.5-flash          ← Latest, best quality, native vision
 *   2. gemini-2.5-flash-preview-05-20  ← Preview variant
 *   3. gemini-2.0-flash          ← Stable fallback
 *
 * Chat (text-only):
 *   1. gemini-2.5-flash          ← Latest, best reasoning
 *   2. gemini-2.5-flash-preview-05-20
 *   3. gemini-2.0-flash          ← Stable fallback
 *
 * Free tier limits (as of 2025):
 *   - gemini-2.5-flash: 10 RPM, 250 RPD, 1M TPM
 *   - gemini-2.0-flash: 15 RPM, 1500 RPD, 1M TPM
 */

const GEMINI_VISION_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.0-flash',
] as const

const GEMINI_TEXT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.0-flash',
] as const

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

// ─── SHARED TYPES ────────────────────────────────────────────────────────────

export interface GeminiMessage {
  role: 'user' | 'model'
  content: string
}

export interface GeminiImagePart {
  mimeType: string
  data: string  // base64
}

export interface GeminiResponse {
  text: string
  model: string
}

// ─── CORE API CALLER ────────────────────────────────────────────────────────

async function callGeminiModel(
  model: string,
  apiKey: string,
  options: {
    contents: Array<{
      role: string
      parts: Array<Record<string, unknown>>
    }>
    systemInstruction?: string
    temperature?: number
    maxOutputTokens?: number
  }
): Promise<GeminiResponse | null> {
  try {
    const body: Record<string, unknown> = {
      contents: options.contents,
      generationConfig: {
        temperature: options.temperature ?? 0.5,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
      },
    }

    if (options.systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: options.systemInstruction }],
      }
    }

    const res = await fetch(
      `${BASE_URL}/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      // Model might not be available yet — skip to next
      return null
    }

    const data = await res.json()

    // Check for safety blocks or empty responses
    const candidate = data.candidates?.[0]
    if (!candidate) return null

    const finishReason = candidate.finishReason
    if (finishReason === 'SAFETY' || finishReason === 'RECITATION') return null

    const text = candidate.content?.parts?.[0]?.text
    if (!text) return null

    return { text, model }
  } catch {
    return null
  }
}

// ─── VISION (IMAGE ANALYSIS) ─────────────────────────────────────────────────

export async function callGeminiVision(
  apiKey: string,
  image: GeminiImagePart,
  prompt: string,
  options?: { temperature?: number; maxOutputTokens?: number }
): Promise<GeminiResponse | null> {
  const imagePart = {
    inline_data: {
      mime_type: image.mimeType,
      data: image.data,
    },
  }

  for (const model of GEMINI_VISION_MODELS) {
    const result = await callGeminiModel(model, apiKey, {
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          imagePart,
        ],
      }],
      temperature: options?.temperature ?? 0.3,
      maxOutputTokens: options?.maxOutputTokens ?? 2048,
    })

    if (result) return result
  }

  return null
}

// ─── CHAT (TEXT-ONLY) ────────────────────────────────────────────────────────

export async function callGeminiChat(
  apiKey: string,
  messages: GeminiMessage[],
  systemPrompt?: string,
  options?: { temperature?: number; maxOutputTokens?: number }
): Promise<GeminiResponse | null> {
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }],
  }))

  for (const model of GEMINI_TEXT_MODELS) {
    const result = await callGeminiModel(model, apiKey, {
      contents,
      systemInstruction: systemPrompt,
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxOutputTokens ?? 1024,
    })

    if (result) return result
  }

  return null
}

// ─── MODEL INFO (for UI display) ────────────────────────────────────────────

export function getActiveModelLabel(model: string): string {
  if (model.startsWith('gemini-2.5')) return 'Gemini 2.5 Flash'
  if (model.startsWith('gemini-2.0')) return 'Gemini 2.0 Flash'
  return 'Gemini'
}

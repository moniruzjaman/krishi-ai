import { NextRequest, NextResponse } from 'next/server'
import {
  matchDiseases,
  calculateConfidence,
  getDiseaseById,
  getSimilarDiseases,
  type DiseaseEntry,
  type PlantPart,
  type SeverityLevel,
  type CausalType,
  CAUSAL_TYPE_LABELS,
} from '@/lib/disease-db'
import { callGeminiVision, getActiveModelLabel } from '@/lib/gemini'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface DiagnosisDisease {
  id: string
  nameBn: string
  nameEn: string
  causalType: CausalType
  causalOrganism: string
  severity: SeverityLevel
  confidence: number
  description: string
  symptoms: string[]
  greenList: string[]
  yellowList: string[]
  prevention: string[]
  similarDiseases: Array<{ id: string; nameBn: string; nameEn: string; causalType: CausalType }>
  spreadMethod: string
  favorableConditions: string
  districts: string[]
  seasonality: string
  affectedParts: PlantPart[]
  isBiotic: boolean
}

interface DiagnosisResponse {
  matchedDiseases: DiagnosisDisease[]
  totalMatches: number
  diagnosisMethod: 'symptom_matching' | 'ai_vision' | 'combined'
  cropId: string
  plantPart: PlantPart
  symptomId: string
  advisoryNote: string
}

// ─── AI VISION ANALYSIS ──────────────────────────────────────────────────────

async function callAIVision(
  imageBase64: string,
  mimeType: string,
  cropId: string,
  plantPart: string,
  symptomDesc: string
): Promise<{ diseases: Partial<DiagnosisDisease>[] | null; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return { diseases: null, model: '' }

  try {
    const prompt = `তুমি একজন কৃষি রোগ বিশেষজ্ঞ। এই ছবিটি বিশ্লেষণ করো এবং গাছের রোগ নির্ণয় করো।

ফসল: ${cropId}
আক্রান্ত অংশ: ${plantPart}
লক্ষণ: ${symptomDesc}

JSON অ্যারে ফরম্যাটে উত্তর দাও (সর্বোচ্চ ৩টি সম্ভাব্য রোগ):
[{
  "nameBn": "রোগের নাম বাংলায়",
  "nameEn": "Disease name in English",
  "causalType": "fungus/bacteria/virus/pest/nematode/abiotic",
  "severity": "low/medium/high/critical",
  "confidence": 0-100,
  "description": "বিস্তারিত বর্ণনা বাংলায়",
  "symptoms": ["লক্ষণ ১", "লক্ষণ ২"],
  "greenList": ["জৈব নিয়ন্ত্রণ ১", "জৈব নিয়ন্ত্রণ ২"],
  "yellowList": ["রাসায়নিক নিয়ন্ত্রণ ১"],
  "prevention": ["প্রতিরোধ ১"],
  "spreadMethod": "ছড়ানোর পদ্ধতি",
  "favorableConditions": "অনুকূল পরিবেশ"
}]`

    const result = await callGeminiVision(
      apiKey,
      { mimeType, data: imageBase64 },
      prompt,
      { temperature: 0.3, maxOutputTokens: 2048 }
    )

    if (!result) return { diseases: null, model: '' }

    const jsonMatch = result.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return { diseases: null, model: result.model }

    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed)) return { diseases: null, model: result.model }

    const diseases = parsed.map((p: Record<string, unknown>) => ({
      id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      nameBn: (p.nameBn as string) || 'অজানা রোগ',
      nameEn: (p.nameEn as string) || 'Unknown Disease',
      causalType: (['fungus', 'bacteria', 'virus', 'pest', 'nematode', 'abiotic'].includes(p.causalType as string)
        ? p.causalType : 'fungus') as CausalType,
      severity: (['low', 'medium', 'high', 'critical'].includes(p.severity as string)
        ? p.severity : 'medium') as SeverityLevel,
      confidence: Math.min(100, Math.max(0, Number(p.confidence) || 65)),
      description: (p.description as string) || 'রোগ নির্ণয় করা যায়নি',
      symptoms: Array.isArray(p.symptoms) ? p.symptoms as string[] : [],
      greenList: Array.isArray(p.greenList) ? p.greenList as string[] : [],
      yellowList: Array.isArray(p.yellowList) ? p.yellowList as string[] : [],
      prevention: Array.isArray(p.prevention) ? p.prevention as string[] : [],
      spreadMethod: (p.spreadMethod as string) || '',
      favorableConditions: (p.favorableConditions as string) || '',
    }))

    return { diseases, model: result.model }
  } catch {
    return { diseases: null, model: '' }
  }
}

// ─── HELPER: Convert DiseaseEntry to DiagnosisDisease ────────────────────────

function toDiagnosisDisease(entry: DiseaseEntry, confidence: number): DiagnosisDisease {
  const similar = getSimilarDiseases(entry.id)
  return {
    id: entry.id,
    nameBn: entry.nameBn,
    nameEn: entry.nameEn,
    causalType: entry.causalType,
    causalOrganism: entry.causalOrganism,
    severity: entry.severity,
    confidence,
    description: entry.description,
    symptoms: entry.symptoms,
    greenList: entry.greenList,
    yellowList: entry.yellowList,
    prevention: entry.prevention,
    similarDiseases: similar.map(s => ({
      id: s.id,
      nameBn: s.nameBn,
      nameEn: s.nameEn,
      causalType: s.causalType,
    })),
    spreadMethod: entry.spreadMethod,
    favorableConditions: entry.favorableConditions,
    districts: entry.districts,
    seasonality: entry.seasonality,
    affectedParts: entry.affectedParts,
    isBiotic: entry.causalType !== 'abiotic',
  }
}

// ─── MAIN POST HANDLER ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      cropId = '',
      plantPart = 'leaf' as PlantPart,
      symptomId = 'not_sure',
      image,
      mimeType,
    } = body

    // ─── Step 1: Symptom-based matching from local database (CABI-style) ──
    const matched = matchDiseases(cropId, plantPart as PlantPart, symptomId)
    const localResults: DiagnosisDisease[] = matched.map(d =>
      toDiagnosisDisease(d, calculateConfidence(d, cropId, plantPart as PlantPart, symptomId))
    )

    // ─── Step 2: AI Vision analysis (if image provided) ──────────────────
    let aiResults: Partial<DiagnosisDisease>[] | null = null
    let aiModel = ''
    if (image && mimeType) {
      const visionResult = await callAIVision(
        image,
        mimeType,
        cropId,
        plantPart,
        symptomId
      )
      aiResults = visionResult.diseases
      aiModel = visionResult.model
    }

    // ─── Step 3: Combine results ─────────────────────────────────────────
    let finalResults: DiagnosisDisease[]
    let diagnosisMethod: DiagnosisResponse['diagnosisMethod']

    if (aiResults && aiResults.length > 0) {
      // Merge AI results with local results
      const aiConverted: DiagnosisDisease[] = aiResults.map(ar => ({
        id: ar.id || `ai_${Date.now()}`,
        nameBn: ar.nameBn || 'অজানা রোগ',
        nameEn: ar.nameEn || 'Unknown Disease',
        causalType: ar.causalType || 'fungus',
        causalOrganism: ar.causalOrganism || '',
        severity: ar.severity || 'medium',
        confidence: ar.confidence || 65,
        description: ar.description || '',
        symptoms: ar.symptoms || [],
        greenList: ar.greenList || [],
        yellowList: ar.yellowList || [],
        prevention: ar.prevention || [],
        similarDiseases: ar.similarDiseases || [],
        spreadMethod: ar.spreadMethod || '',
        favorableConditions: ar.favorableConditions || '',
        districts: ar.districts || [],
        seasonality: ar.seasonality || '',
        affectedParts: ar.affectedParts || [plantPart as PlantPart],
        isBiotic: ar.causalType !== 'abiotic',
      }))

      // Deduplicate: if AI result matches a local result by name, prefer local (more complete data)
      const localNames = new Set(localResults.map(r => r.nameBn))
      const uniqueAiResults = aiConverted.filter(r => !localNames.has(r.nameBn))

      // Boost confidence for results that appear in both AI and local
      const boostedLocal = localResults.map(r => ({
        ...r,
        confidence: Math.min(100, r.confidence + 10), // Boost for dual confirmation
      }))

      finalResults = [...boostedLocal, ...uniqueAiResults].sort(
        (a, b) => b.confidence - a.confidence
      )
      diagnosisMethod = 'combined'
    } else if (localResults.length > 0) {
      finalResults = localResults
      diagnosisMethod = 'symptom_matching'
    } else {
      // No matches found - return generic advisory
      finalResults = [{
        id: 'no_match',
        nameBn: 'রোগ নির্ণয় অনিশ্চিত',
        nameEn: 'Diagnosis Uncertain',
        causalType: 'abiotic',
        causalOrganism: 'নির্ধারণ করা যায়নি',
        severity: 'medium',
        confidence: 30,
        description: 'আপনার উল্লেখিত লক্ষণের সাথে কোনো নির্দিষ্ট রোগের মিল পাওয়া যায়নি। অনুগ্রহ করে আরও বিস্তারিত লক্ষণ দেখান অথবা নিকটতম কৃষি অফিসে যোগাযোগ করুন।',
        symptoms: [],
        greenList: [
          'নিকটতম কৃষি সম্প্রসারণ অফিসে যোগাযোগ করুন',
          'আক্রান্ত গাছের ছবি তুলে সংরক্ষণ করুন',
          'লক্ষণগুলো নথিবদ্ধ করুন',
        ],
        yellowList: [],
        prevention: [
          'নিয়মিত ফসল পরিদর্শন করুন',
          'সুস্থ বীজ ব্যবহার করুন',
          'সুষম সার প্রয়োগ করুন',
        ],
        similarDiseases: [],
        spreadMethod: 'অজানা',
        favorableConditions: 'অজানা',
        districts: [],
        seasonality: '',
        affectedParts: [plantPart as PlantPart],
        isBiotic: true,
      }]
      diagnosisMethod = 'symptom_matching'
    }

    // ─── Step 4: Generate advisory note ──────────────────────────────────
    const advisoryNote = generateAdvisory(cropId, plantPart, symptomId, finalResults)

    // ─── Step 5: Build response ──────────────────────────────────────────
    const response: DiagnosisResponse = {
      matchedDiseases: finalResults.slice(0, 5), // Top 5 matches
      totalMatches: finalResults.length,
      diagnosisMethod,
      cropId,
      plantPart: plantPart as PlantPart,
      symptomId,
      advisoryNote,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json({
      matchedDiseases: [{
        id: 'error',
        nameBn: 'বিশ্লেষণ ত্রুটি',
        nameEn: 'Analysis Error',
        causalType: 'abiotic' as CausalType,
        causalOrganism: '',
        severity: 'medium' as SeverityLevel,
        confidence: 50,
        description: 'ছবি বিশ্লেষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা নিকটতম কৃষি অফিসে যোগাযোগ করুন।',
        symptoms: [],
        greenList: ['নিকটতম কৃষি অফিসারের পরামর্শ নিন'],
        yellowList: [],
        prevention: ['কৃষি অফিসারের সাথে পরামর্শ করুন'],
        similarDiseases: [],
        spreadMethod: '',
        favorableConditions: '',
        districts: [],
        seasonality: '',
        affectedParts: ['leaf' as PlantPart],
        isBiotic: true,
      }],
      totalMatches: 1,
      diagnosisMethod: 'symptom_matching',
      cropId: '',
      plantPart: 'leaf' as PlantPart,
      symptomId: 'not_sure',
      advisoryNote: 'বিশ্লেষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    }, { status: 500 })
  }
}

// ─── ADVISORY NOTE GENERATOR ────────────────────────────────────────────────

function generateAdvisory(
  cropId: string,
  plantPart: string,
  symptomId: string,
  results: DiagnosisDisease[]
): string {
  const hasCritical = results.some(r => r.severity === 'critical')
  const hasHigh = results.some(r => r.severity === 'high')
  const isAbiotic = results.some(r => !r.isBiotic)

  let note = ''

  if (hasCritical) {
    note = '⚠️ সংকটাপন্ন রোগ শনাক্ত হয়েছে! অবিলম্বে ব্যবস্থা নিন। স্থানীয় কৃষি অফিসারের পরামর্শ নিন এবং আক্রান্ত গাছ অপসারণ করুন।'
  } else if (hasHigh) {
    note = '🟠 মারাত্মক রোগ শনাক্ত হয়েছে। দ্রুত ব্যবস্থা নিলে ফসল রক্ষা করা সম্ভব। সবুজ তালিকার (Green List) পদ্ধতি আগে চেষ্টা করুন।'
  } else if (isAbiotic) {
    note = '🔵 এটি পরিবেশগত/পুষ্টিজনিত সমস্যা হতে পারে (জীবাণু জড়িত নয়)। মাটি পরীক্ষা ও সেচ ব্যবস্থা উন্নত করুন।'
  } else {
    note = '🟢 হালকা থেকে মাঝারি মাত্রার সমস্যা। সবুজ তালিকার (Green List) জৈব পদ্ধতি দিয়ে শুরু করুন। প্রয়োজনে হলুদ তালিকার (Yellow List) রাসায়নিক ব্যবস্থা নিন।'
  }

  note += ' CABI Plantwise পদ্ধতি অনুসারে, সবুজ তালিকা (জৈব/প্রতিরোধমূলক) পদ্ধতি সর্বদা আগে চেষ্টা করুন, হলুদ তালিকা (রাসায়নিক) শেষ উপায় হিসেবে ব্যবহার করুন।'

  return note
}

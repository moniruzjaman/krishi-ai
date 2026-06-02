// Cloudflare Pages Function — /api/analyze
// Mirrors the Vercel serverless function at src/app/api/analyze/route.ts
// CABI PlantwisePlus-style multi-factor diagnosis

const DISEASE_DB = [
  {
    id: 'rice_blast',
    nameBn: 'ব্লাস্ট রোগ',
    nameEn: 'Rice Blast',
    causalType: 'fungus',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'stem', 'fruit', 'seed'],
    symptomKeywords: ['discolor', 'spots', 'brown', 'lesion'],
    severity: 'high',
    description: 'ধানের সবচেয়ে ধ্বংসাত্মক ছত্রাকজনিত রোগ। পাতা, কাণ্ড ও শীষে আক্রমণ করে।',
    greenList: ['প্রতিরোধী জাত ব্যবহার করুন (ব্রি ধান-৪৯)', 'সুষম সার প্রয়োগ করুন', 'আক্রান্ত পাতা অপসারণ করুন'],
    yellowList: ['ট্রাইসাইক্লাজোল ৭৫ WP @ ০.৬ গ্রাম/লিটার স্প্রে', 'আইসোপ্রোথিওলেন ৪০ EC স্প্রে'],
    prevention: ['প্রতিরোধী জাত', 'সুষম সার', 'বীজ শোধন'],
    spreadMethod: 'বাতাসের মাধ্যমে স্পোর ছড়ায়',
    favorableConditions: 'আর্দ্রতা ৮৯%+, তাপমাত্রা ২৫-২৮°C',
    similarDiseases: ['brown_spot', 'bacterial_leaf_blight'],
  },
  {
    id: 'bacterial_leaf_blight',
    nameBn: 'ব্যাকটেরিয়াল লিফ ব্লাইট',
    nameEn: 'Bacterial Leaf Blight',
    causalType: 'bacteria',
    affectedCrops: ['rice'],
    affectedParts: ['leaf'],
    symptomKeywords: ['discolor', 'wilt', 'yellow', 'white'],
    severity: 'high',
    description: 'ধানের পাতায় ব্যাকটেরিয়া সংক্রমণ। বন্যার পানি ও ঝড়ের বৃষ্টির মাধ্যমে ছড়ায়।',
    greenList: ['প্রতিরোধী জাত ব্যবহার করুন', 'পানি নিষ্কাশন উন্নত করুন', 'আক্রান্ত অংশ অপসারণ করুন'],
    yellowList: ['স্ট্রেপটোমাইসিন সালফেট + কপার অক্সিক্লোরাইড স্প্রে', 'কপার হাইড্রক্সাইড ৭৭ WP স্প্রে'],
    prevention: ['প্রতিরোধী জাত', 'বীজ শোধন', 'পানি ব্যবস্থাপনা'],
    spreadMethod: 'বন্যার পানি, বৃষ্টির ফোঁটা',
    favorableConditions: 'বন্যাপরবর্তী, উচ্চ আর্দ্রতা',
    similarDiseases: ['rice_blast', 'brown_spot'],
  },
  {
    id: 'brown_spot',
    nameBn: 'বাদামি গাঁজ রোগ',
    nameEn: 'Brown Spot',
    causalType: 'fungus',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'seed', 'fruit'],
    symptomKeywords: ['spots', 'discolor', 'brown'],
    severity: 'medium',
    description: 'পুষ্টিহীন মাটিতে ধানে বেশি দেখা যায়। পটাসিয়াম ও সিলিকনের অভাবে রোগ বাড়ে।',
    greenList: ['পটাসিয়ামের মাত্রা বাড়ান', 'প্রতিরোধী জাত ব্যবহার', 'জৈব সার ব্যবহার'],
    yellowList: ['প্রোপিকোনাজোল ২৫ EC স্প্রে', 'ম্যানকোজেব ৬৩ WP স্প্রে'],
    prevention: ['সুষম সার', 'প্রতিরোধী জাত', 'বীজ শোধন'],
    spreadMethod: 'বাতাসে স্পোর ছড়ায়',
    favorableConditions: 'পুষ্টিহীন মাটি, পটাশিয়ামের অভাব',
    similarDiseases: ['rice_blast', 'leaf_scald'],
  },
  {
    id: 'tungro',
    nameBn: 'টুংরো রোগ',
    nameEn: 'Rice Tungro Disease',
    causalType: 'virus',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'whole'],
    symptomKeywords: ['discolor', 'growth', 'yellow', 'orange', 'stunt'],
    severity: 'critical',
    description: 'সবুজ পাতাফড়িং মাধ্যমে ছড়ানো ভাইরাস রোগ। পুরো জমি সংক্রমিত হতে পারে।',
    greenList: ['আক্রান্ত গাছ অবিলম্বে ধ্বংস করুন', 'প্রতিরোধী জাত ব্যবহার', 'হলুদ আঠালো ফাঁদ ব্যবহার'],
    yellowList: ['ইমিডাক্লোপ্রিড ২০ SL স্প্রে', 'থায়োমিথক্সাম ২৫ WG স্প্রে'],
    prevention: ['প্রতিরোধী জাত', 'পাতাফড়িং মুক্ত চারা', 'ফসল পর্যায়ক্রম'],
    spreadMethod: 'সবুজ পাতাফড়িং মাধ্যমে',
    favorableConditions: 'পাতাফড়িং প্রাচুর্য, ২৮-৩২°C',
    similarDiseases: ['rice_blast'],
  },
  {
    id: 'leaf_scorch',
    nameBn: 'শুষ্ক পাতা পোড়া',
    nameEn: 'Leaf Scorch (Abiotic)',
    causalType: 'abiotic',
    affectedCrops: ['rice', 'wheat', 'maize', 'jute', 'mustard', 'onion', 'potato', 'tomato', 'brinjal'],
    affectedParts: ['leaf'],
    symptomKeywords: ['discolor', 'wilt', 'brown', 'dry'],
    severity: 'medium',
    description: 'পরিবেশগত কারণে পাতা শুকিয়ে যায়। পানির অভাব, লবণাক্ততা বা অতিরিক্ত তাপে হতে পারে।',
    greenList: ['নিয়মিত সেচ নিশ্চিত করুন', 'মাটির লবণাক্ততা পরীক্ষা করুন', 'জৈব সার প্রয়োগ', 'মালচিং করুন'],
    yellowList: ['লবণাক্ততায় জিপসাম প্রয়োগ', 'সুষম সার প্রয়োগ'],
    prevention: ['নিয়মিত সেচ', 'মালচিং', 'মাটির গুণমান উন্নত'],
    spreadMethod: 'সংক্রামক নয়',
    favorableConditions: 'খরা, লবণাক্ত মাটি, অতিরিক্ত তাপ',
    similarDiseases: ['rice_blast', 'brown_spot'],
  },
];

const SYMPTOM_KEYWORDS = {
  discolor: ['discolor', 'yellow', 'brown', 'চারা'],
  spots: ['spots', 'lesion', 'দাগ', 'ক্ষত'],
  rot: ['rot', 'decay', 'পচন', 'গলন'],
  wilt: ['wilt', 'dry', 'শুকনো', 'মৃত্যু'],
  deform: ['deform', 'curl', 'twist', 'বাঁকা', 'বিকৃতি'],
  pest_damage: ['pest', 'holes', 'borer', 'পোকা', 'গর্ত'],
  growth: ['stunt', 'dwarf', 'বামন', 'বৃদ্ধি'],
};

function matchDiseases(cropId, plantPart, symptomId) {
  const keywords = SYMPTOM_KEYWORDS[symptomId] || [];
  return DISEASE_DB
    .filter(d => {
      if (!d.affectedCrops.includes(cropId)) return false;
      if (!d.affectedParts.includes(plantPart)) return false;
      if (symptomId === 'not_sure') return true;
      return keywords.some(kw => d.symptomKeywords.some(sk => sk.includes(kw) || kw.includes(sk)));
    })
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.severity] - order[b.severity];
    });
}

function calculateConfidence(disease, cropId, plantPart, symptomId) {
  let score = 0;
  if (disease.affectedCrops.includes(cropId)) score += 30;
  if (disease.affectedParts.includes(plantPart)) score += 25;
  if (symptomId !== 'not_sure') {
    const keywords = SYMPTOM_KEYWORDS[symptomId] || [];
    const hasMatch = keywords.some(kw => disease.symptomKeywords.some(sk => sk.includes(kw) || kw.includes(sk)));
    if (hasMatch) score += 35;
  } else {
    score += 15;
  }
  score += 10;
  return Math.round((score / 100) * 100);
}

export async function onRequestPost(context) {
  try {
    const { cropId = '', plantPart = 'leaf', symptomId = 'not_sure', image, mimeType } = await context.request.json();

    // Step 1: Symptom-based matching from local database
    const matched = matchDiseases(cropId, plantPart, symptomId);
    const localResults = matched.map(d => ({
      ...d,
      confidence: calculateConfidence(d, cropId, plantPart, symptomId),
      isBiotic: d.causalType !== 'abiotic',
      similarDiseases: (d.similarDiseases || []).map(sid => {
        const found = DISEASE_DB.find(x => x.id === sid);
        return found ? { id: found.id, nameBn: found.nameBn, nameEn: found.nameEn, causalType: found.causalType } : null;
      }).filter(Boolean),
    }));

    // Step 2: Try Gemini Vision (if image provided and API key available)
    // Model cascade: gemini-2.5-flash → gemini-2.5-flash-preview-05-20 → gemini-2.0-flash
    let aiResults = null;
    let aiModel = '';
    if (image && mimeType) {
      const apiKey = context.env?.GEMINI_API_KEY;
      if (apiKey) {
        const VISION_MODELS = [
          'gemini-2.5-flash',
          'gemini-2.5-flash-preview-05-20',
          'gemini-2.0-flash',
        ];
        for (const model of VISION_MODELS) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{
                    parts: [
                      { text: `তুমি একজন কৃষি রোগ বিশেষজ্ঞ। এই ছবিটি বিশ্লেষণ করো। ফসল: ${cropId}, অংশ: ${plantPart}। JSON অ্যারে ফরম্যাটে ৩টি সম্ভাব্য রোগ: [{"nameBn":"নাম","nameEn":"Name","causalType":"fungus","severity":"medium","confidence":75,"description":"বর্ণনা","greenList":["জৈব"],"yellowList":["রাসায়নিক"],"prevention":["প্রতিরোধ"],"spreadMethod":"ছড়ানো","favorableConditions":"পরিবেশ"}]` },
                      { inline_data: { mime_type: mimeType, data: image } }
                    ]
                  }],
                  generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
                })
              }
            );
            if (res.ok) {
              const data = await res.json();
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                const match = text.match(/\[[\s\S]*\]/);
                if (match) {
                  aiResults = JSON.parse(match[0]);
                  aiModel = model;
                  break;
                }
              }
            }
          } catch { continue; }
        }
      }
    }

    // Step 3: Combine results
    let finalResults = localResults;
    let diagnosisMethod = 'symptom_matching';

    if (aiResults && aiResults.length > 0) {
      const localNames = new Set(localResults.map(r => r.nameBn));
      const uniqueAi = aiResults.filter(r => !localNames.has(r.nameBn)).map(r => ({
        id: `ai_${Date.now()}`,
        nameBn: r.nameBn || 'অজানা রোগ',
        nameEn: r.nameEn || 'Unknown',
        causalType: r.causalType || 'fungus',
        severity: ['low','medium','high','critical'].includes(r.severity) ? r.severity : 'medium',
        confidence: Math.min(100, Math.max(0, Number(r.confidence) || 65)),
        description: r.description || '',
        greenList: r.greenList || [],
        yellowList: r.yellowList || [],
        prevention: r.prevention || [],
        spreadMethod: r.spreadMethod || '',
        favorableConditions: r.favorableConditions || '',
        isBiotic: r.causalType !== 'abiotic',
        similarDiseases: [],
        affectedParts: [plantPart],
      }));
      finalResults = [...localResults.map(r => ({ ...r, confidence: Math.min(100, r.confidence + 10) })), ...uniqueAi]
        .sort((a, b) => b.confidence - a.confidence);
      diagnosisMethod = 'combined';
    }

    // Advisory note
    const hasCritical = finalResults.some(r => r.severity === 'critical');
    const hasHigh = finalResults.some(r => r.severity === 'high');
    const isAbiotic = finalResults.some(r => r.causalType === 'abiotic');
    let advisoryNote = '';
    if (hasCritical) advisoryNote = '⚠️ সংকটাপন্ন রোগ শনাক্ত! অবিলম্বে ব্যবস্থা নিন।';
    else if (hasHigh) advisoryNote = '🟠 মারাত্মক রোগ শনাক্ত। সবুজ তালিকা আগে চেষ্টা করুন।';
    else if (isAbiotic) advisoryNote = '🔵 পরিবেশগত/পুষ্টিজনিত সমস্যা। মাটি পরীক্ষা করুন।';
    else advisoryNote = '🟢 হালকা-মাঝারি সমস্যা। জৈব পদ্ধতি দিয়ে শুরু করুন।';
    advisoryNote += ' CABI Plantwise পদ্ধতি: সবুজ তালিকা (জৈব) আগে, হলুদ তালিকা (রাসায়নিক) শেষে।';

    if (finalResults.length === 0) {
      finalResults = [{
        id: 'no_match',
        nameBn: 'রোগ নির্ণয় অনিশ্চিত',
        nameEn: 'Diagnosis Uncertain',
        causalType: 'abiotic',
        severity: 'medium',
        confidence: 30,
        description: 'উল্লেখিত লক্ষণের সাথে নির্দিষ্ট রোগের মিল পাওয়া যায়নি। কৃষি অফিসে যোগাযোগ করুন।',
        greenList: ['নিকটতম কৃষি অফিসে যোগাযোগ করুন', 'আক্রান্ত গাছের ছবি সংরক্ষণ করুন'],
        yellowList: [],
        prevention: ['নিয়মিত ফসল পরিদর্শন', 'সুস্থ বীজ ব্যবহার'],
        spreadMethod: 'অজানা',
        favorableConditions: 'অজানা',
        isBiotic: true,
        similarDiseases: [],
        affectedParts: [plantPart],
      }];
    }

    return new Response(JSON.stringify({
      matchedDiseases: finalResults.slice(0, 5),
      totalMatches: finalResults.length,
      diagnosisMethod,
      cropId,
      plantPart,
      symptomId,
      advisoryNote,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch {
    return new Response(JSON.stringify({
      matchedDiseases: [{
        id: 'error',
        nameBn: 'বিশ্লেষণ ত্রুটি',
        nameEn: 'Analysis Error',
        causalType: 'abiotic',
        severity: 'medium',
        confidence: 50,
        description: 'বিশ্লেষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
        greenList: ['কৃষি অফিসারের পরামর্শ নিন'],
        yellowList: [],
        prevention: [],
        spreadMethod: '',
        favorableConditions: '',
        isBiotic: true,
        similarDiseases: [],
        affectedParts: ['leaf'],
      }],
      totalMatches: 1,
      diagnosisMethod: 'symptom_matching',
      cropId: '',
      plantPart: 'leaf',
      symptomId: 'not_sure',
      advisoryNote: 'বিশ্লেষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    }), { headers: { 'Content-Type': 'application/json' } });
  }
}

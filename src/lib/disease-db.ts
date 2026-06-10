/**
 * CABI PlantwisePlus-Style Disease Database for Bangladesh Crops
 * Inspired by CABI's "Identify a Pest" diagnostic methodology:
 *   Country → Crop → Plant Part → Symptom → Results → Factsheet
 *
 * Each disease includes:
 *   - Causal organism type (biotic: fungus/bacteria/virus/pest vs abiotic)
 *   - Affected crops & plant parts
 *   - Symptom descriptions for matching
 *   - Green List (biological/organic controls — no pesticides)
 *   - Yellow List (chemical controls with safety restrictions)
 *   - Prevention checklist
 *   - Similar diseases (confusion table, CABI-style)
 *   - Geographic relevance (Bangladesh districts)
 */

export type CausalType = 'fungus' | 'bacteria' | 'virus' | 'pest' | 'nematode' | 'abiotic'
export type PlantPart = 'leaf' | 'stem' | 'fruit' | 'root' | 'whole' | 'seed'
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export interface DiseaseEntry {
  id: string
  nameBn: string
  nameEn: string
  causalType: CausalType
  causalOrganism: string
  affectedCrops: string[]
  affectedParts: PlantPart[]
  symptoms: string[]
  symptomKeywords: string[]  // for matching user-selected symptoms
  severity: SeverityLevel
  description: string
  greenList: string[]        // Biological/organic controls (CABI Green List)
  yellowList: string[]       // Chemical controls with restrictions (CABI Yellow List)
  prevention: string[]
  similarDiseases: string[]  // IDs of similar diseases (confusion table)
  spreadMethod: string
  favorableConditions: string
  districts: string[]        // Bangladesh districts where common
  seasonality: string        // When it typically occurs
}

export const CROP_LIST = [
  { id: 'rice', nameBn: 'ধান', icon: '🌾' },
  { id: 'wheat', nameBn: 'গম', icon: '🌿' },
  { id: 'jute', nameBn: 'পাট', icon: '🪴' },
  { id: 'potato', nameBn: 'আলু', icon: '🥔' },
  { id: 'mustard', nameBn: 'সরিষা', icon: '🌼' },
  { id: 'onion', nameBn: 'পেঁয়াজ', icon: '🧅' },
  { id: 'maize', nameBn: 'ভুট্টা', icon: '🌽' },
  { id: 'lentil', nameBn: 'মসুর ডাল', icon: '🫘' },
  { id: 'sugarcane', nameBn: 'আখ', icon: '🎋' },
  { id: 'cotton', nameBn: 'তুলা', icon: '☁️' },
  { id: 'tomato', nameBn: 'টমেটো', icon: '🍅' },
  { id: 'brinjal', nameBn: 'বেগুন', icon: '🍆' },
] as const

export const PLANT_PARTS = [
  { id: 'leaf' as PlantPart, nameBn: 'পাতা', icon: '🍃' },
  { id: 'stem' as PlantPart, nameBn: 'কাণ্ড/ডালপালা', icon: '🌿' },
  { id: 'fruit' as PlantPart, nameBn: 'ফল/ফসল', icon: '🍎' },
  { id: 'root' as PlantPart, nameBn: 'শিকড়/মূল', icon: '🌱' },
  { id: 'whole' as PlantPart, nameBn: 'পুরো গাছ', icon: '🪴' },
  { id: 'seed' as PlantPart, nameBn: 'বীজ/চারা', icon: '🌰' },
] as const

export const SYMPTOM_TYPES = [
  { id: 'discolor', nameBn: 'রঙ পরিবর্তন (হলুদ/বাদামি)', keywords: ['discolor', 'yellow', 'brown', 'চারা'] },
  { id: 'spots', nameBn: 'দাগ / ক্ষত / ছোঁয়া', keywords: ['spots', 'lesion', 'দাগ', 'ক্ষত'] },
  { id: 'rot', nameBn: 'পচন / গলন', keywords: ['rot', 'decay', 'পচন', 'গলন'] },
  { id: 'wilt', nameBn: 'শুকিয়ে যাওয়া / মৃত্যু', keywords: ['wilt', 'dry', 'শুকনো', 'মৃত্যু'] },
  { id: 'deform', nameBn: 'বাঁকা / মোড়া / বিকৃতি', keywords: ['deform', 'curl', 'twist', 'বাঁকা', 'বিকৃতি'] },
  { id: 'pest_damage', nameBn: 'পোকার ক্ষত / গর্ত', keywords: ['pest', 'holes', 'borer', 'পোকা', 'গর্ত'] },
  { id: 'growth', nameBn: 'বৃদ্ধি বাধা / বামন', keywords: ['stunt', 'dwarf', 'বামন', 'বৃদ্ধি'] },
  { id: 'not_sure', nameBn: 'নিশ্চিত নই', keywords: [] },
] as const

export const CAUSAL_TYPE_LABELS: Record<CausalType, { bn: string; en: string; color: string }> = {
  fungus: { bn: 'ছত্রাকজনিত', en: 'Fungal', color: '#795548' },
  bacteria: { bn: 'ব্যাকটেরিয়াজনিত', en: 'Bacterial', color: '#E65100' },
  virus: { bn: 'ভাইরাসজনিত', en: 'Viral', color: '#D32F2F' },
  pest: { bn: 'পোকামাকড়জনিত', en: 'Insect Pest', color: '#5D4037' },
  nematode: { bn: 'নেমাটোডজনিত', en: 'Nematode', color: '#455A64' },
  abiotic: { bn: 'অজৈব/পরিবেশজনিত', en: 'Abiotic/Environmental', color: '#0288D1' },
}

// ─── DISEASE DATABASE ────────────────────────────────────────────────────────

export const DISEASE_DB: DiseaseEntry[] = [
  // ─── RICE DISEASES ───
  {
    id: 'rice_blast',
    nameBn: 'ব্লাস্ট রোগ',
    nameEn: 'Rice Blast',
    causalType: 'fungus',
    causalOrganism: 'Magnaporthe oryzae',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'stem', 'fruit', 'seed'],
    symptoms: [
      'পাতায় হীরাকৃতির বাদামি-ধূসর দাগ',
      'দাগের কেন্দ্র ছাইরঙা, কিনারা বাদামি',
      'কাণ্ডের গোড়ায় কালচে দাগ (নেক ব্লাস্ট)',
      'শীষের ডাঁটায় বাদামি দাগ',
    ],
    symptomKeywords: ['discolor', 'spots', 'brown', 'lesion', 'দাগ', 'বাদামি'],
    severity: 'high',
    description: 'ধানের সবচেয়ে ধ্বংসাত্মক ছত্রাকজনিত রোগ। পাতা, কাণ্ড ও শীষে আক্রমণ করে। মেঘলা আবহাওয়ায় (আর্দ্রতা ৮৯%+), রাতে তাপমাত্রা ২৫-২৮°C হলে দ্রুত ছড়ায়।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (ব্রি ধান-৪৯, ব্রি ধান-৮১, ব্রি ধান-৮৪)',
      'সুষম সার প্রয়োগ করুন (অতিরিক্ত নাইট্রোজেন এড়িয়ে চলুন)',
      'ফসলের অবশিষ্টাংশ পুড়ে ধ্বংস করুন',
      'সারি থেকে সারি সঠিক দূরত্ব বজায় রাখুন (বায়ু চলাচল নিশ্চিত করতে)',
      'বীজ শোধন করে বপন করুন (গরম পানিতে ৫৪°C, ১৫ মিনিট)',
      'আক্রান্ত পাতা অবিলম্বে অপসারণ করুন',
    ],
    yellowList: [
      'ট্রাইসাইক্লাজোল ৭৫ WP @ ০.৬ গ্রাম/লিটার পানিতে মিশিয়ে স্প্রে করুন',
      'আইসোপ্রোথিওলেন ৪০ EC @ ১.৫ মিলি/লিটার পানিতে স্প্রে করুন',
      'প্রতি ১০-১২ দিন অন্তর দুইবার স্প্রে করুন',
      'সতর্কতা: ফসল কাটার ২১ দিন আগে স্প্রে বন্ধ করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত নির্বাচন',
      'সুষম সার ব্যবহার',
      'উপযুক্ত বপন সময় মেনে চলা',
      'বীজ শোধন',
      'ফসল পর্যায়ক্রম (Crop rotation)',
    ],
    similarDiseases: ['brown_spot', 'leaf_scald', 'bacterial_leaf_blight'],
    spreadMethod: 'বাতাসের মাধ্যমে স্পোর ছড়ায়, বীজ ও ফসলের অবশিষ্টাংশ থেকেও ছড়ায়',
    favorableConditions: 'আর্দ্রতা ৮৯%+, তাপমাত্রা ২৫-২৮°C, ঘন কুয়াশা, অতিরিক্ত নাইট্রোজেন সার',
    districts: ['দিনাজপুর', 'রংপুর', 'ময়মনসিংহ', 'সিলেট', 'কুমিল্লা', 'বরিশাল'],
    seasonality: 'ভাদ্র-আশ্বিন (আউশ ধান), মাঘ-ফাল্গুন (বোরো ধান)',
  },
  {
    id: 'bacterial_leaf_blight',
    nameBn: 'ব্যাকটেরিয়াল লিফ ব্লাইট',
    nameEn: 'Bacterial Leaf Blight (BLB)',
    causalType: 'bacteria',
    causalOrganism: 'Xanthomonas oryzae pv. oryzae',
    affectedCrops: ['rice'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতার কিনারা থেকে হলদেটে-সাদা পারদার দাগ শুরু',
      'দাগ ধীরে ধীরে পুরো পাতা জুড়ে ছড়ায়',
      'পাতা শুকিয়ে বাদামি-সাদা হয়ে যায়',
      'সকালে আর্দ্রতায় পাতায় হলুদ আঠালো ফোঁটা দেখা যায়',
    ],
    symptomKeywords: ['discolor', 'wilt', 'yellow', 'white', 'হলুদ', 'শুকনো', 'পারদা'],
    severity: 'high',
    description: 'ধানের পাতায় ব্যাকটেরিয়া সংক্রমণ। বন্যার পানি, ঝড়ের বৃষ্টি ও আঘাতের মাধ্যমে ছড়ায়। বোরো ও আউশ মৌসুমে বেশি দেখা যায়।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (ব্রি ধান-৫৪, ব্রি ধান-৭৬)',
      'ক্ষতিগ্রস্ত পাতা অবিলম্বে কেটে ফেলুন',
      'পানি নিষ্কাশন ব্যবস্থা উন্নত করুন',
      'আক্রান্ত জমির ফসল অবশিষ্টাংশ পুড়ে ফেলুন',
      'বীজতলায় বীজ শোধন করুন',
    ],
    yellowList: [
      'স্ট্রেপটোমাইসিন সালফেট + কপার অক্সিক্লোরাইড মিশ্রণ স্প্রে করুন',
      'কপার হাইড্রক্সাইড ৭৭ WP @ ২ গ্রাম/লিটার পানিতে স্প্রে',
      'বন্যার পানি নামার পর সাথে সাথে স্প্রে করুন',
      'সতর্কতা: কপার যৌগ মাটির উর্বরতা কমাতে পারে, পরিমিত ব্যবহার করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত নির্বাচন',
      'বীজ শোধন (হট ওয়াটার ট্রিটমেন্ট)',
      'সঠিক সার ব্যবস্থাপনা',
      'পানি ব্যবস্থাপনা উন্নত করা',
      'ফসল পর্যায়ক্রম',
    ],
    similarDiseases: ['rice_blast', 'brown_spot', 'leaf_scald'],
    spreadMethod: 'বন্যার পানি, বৃষ্টির ফোঁটা, সংক্রমিত বীজ ও চারা',
    favorableConditions: 'বন্যাপরবর্তী অবস্থা, উচ্চ আর্দ্রতা, ঝড়ের বৃষ্টি, তাপমাত্রা ২৫-৩৪°C',
    districts: ['রাজশাহী', 'কুষ্টিয়া', 'পাবনা', 'নাটোর', 'বরিশাল', 'নোয়াখালী'],
    seasonality: 'ভাদ্র-আশ্বিন (আউশ), চৈত্র-বৈশাখ (বোরো)',
  },
  {
    id: 'brown_spot',
    nameBn: 'বাদামি গাঁজ রোগ',
    nameEn: 'Brown Spot',
    causalType: 'fungus',
    causalOrganism: 'Bipolaris oryzae',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'seed', 'fruit'],
    symptoms: [
      'পাতায় ছোট ছোট বাদামি গোলাকার দাগ',
      'দাগের কেন্দ্র হালকা বাদামি, কিনারা গাঢ় বাদামি',
      'শীষে দাগ পড়ে দানা খড়খড়ে হয়',
      'পুষ্টিহীন মাটিতে বেশি হয়',
    ],
    symptomKeywords: ['spots', 'discolor', 'brown', 'বাদামি', 'দাগ', 'গোলাকার'],
    severity: 'medium',
    description: 'পুষ্টিহীন মাটিতে জাতের ধানে বেশি দেখা যায়। পটাসিয়াম ও সিলিকনের অভাবে রোগ বাড়ে। বিহার দুর্ভিক্ষের প্রধান কারণ এই রোগ।',
    greenList: [
      'মাটিতে পটাশিয়ামের মাত্রা বাড়ান (সুষম সার প্রয়োগ)',
      'প্রতিরোধী জাত ব্যবহার করুন',
      'বীজ শোধন করে বপন করুন',
      'জৈব সার ব্যবহার করুন',
      'ফসলের অবশিষ্টাংশ জমিতে মিশিয়ে দিন (সিলিকন পুনর্ব্যবহার)',
    ],
    yellowList: [
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'প্রতি ১৫ দিন অন্তর ২-৩ বার স্প্রে করুন',
    ],
    prevention: [
      'সুষম সার প্রয়োগ (পটাশিয়াম নিশ্চিত)',
      'প্রতিরোধী জাত নির্বাচন',
      'বীজ শোধন',
      'জৈব সার ব্যবহার',
      'ফসল পর্যায়ক্রম',
    ],
    similarDiseases: ['rice_blast', 'leaf_scald', 'narrow_brown_spot'],
    spreadMethod: 'বাতাসের মাধ্যমে স্পোর ছড়ায়, সংক্রমিত বীজ',
    favorableConditions: 'পুষ্টিহীন মাটি, পটাশিয়ামের অভাব, তাপমাত্রা ২৫-৩০°C, উচ্চ আর্দ্রতা',
    districts: ['ময়মনসিংহ', 'টাঙ্গাইল', 'কিশোরগঞ্জ', 'নেত্রকোনা'],
    seasonality: 'সারা বছর, বিশেষত আউশ মৌসুমে',
  },
  {
    id: 'tungro',
    nameBn: 'টুংরো রোগ',
    nameEn: 'Rice Tungro Disease',
    causalType: 'virus',
    causalOrganism: 'Rice tungro bacilliform virus + Rice tungro spherical virus',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'whole'],
    symptoms: [
      'পাতা হলদেটে-কমলা হয়ে যায়',
      'গাছ বামন আকারের হয়',
      'পাতার আগা কমলা বর্ণ ধারণ করে',
      'নতুন পাতা ছোট ও হলুদ হয়',
    ],
    symptomKeywords: ['discolor', 'growth', 'yellow', 'orange', 'stunt', 'হলুদ', 'কমলা', 'বামন'],
    severity: 'critical',
    description: 'ধানের সবচেয়ে ভয়াবহ ভাইরাস রোগ। সবুজ পাতাফড়িং (Nephotettix virescens) মাধ্যমে ছড়ায়। একবার আক্রান্ত গাছ থেকে পুরো জমি সংক্রমিত হতে পারে।',
    greenList: [
      'অবিলম্বে আক্রান্ত গাছ উঠিয়ে ধ্বংস করুন',
      'প্রতিরোধী জাত ব্যবহার করুন (ব্রি ধান-৯০, ব্রি ধান-৯১)',
      'একই জমিতে বারবার ধান চাষ এড়িয়ে চলুন',
      'সবুজ পাতাফড়িং দমনে হলুদ আঠালো ফাঁদ ব্যবহার করুন',
      'চারা রোপণের সময় সংক্রমণ এড়িয়ে চলুন',
    ],
    yellowList: [
      'সবুজ পাতাফড়িং দমনে ইমিডাক্লোপ্রিড ২০ SL @ ২ মিলি/লিটার স্প্রে',
      'থায়োমিথক্সাম ২৫ WG @ ০.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'সতর্কতা: পোকানাশক মৌমাছি ও উপকারী পোকামাকড়কে ক্ষতি করতে পারে',
      'সতর্কতা: ব্যবহারের সময় সুরক্ষা সরঞ্জাম পরুন',
    ],
    prevention: [
      'প্রতিরোধী জাত নির্বাচন',
      'পাতাফড়িং মুক্ত চারা রোপণ',
      'ফসল পর্যায়ক্রম',
      'আগাম বপন',
      'আক্রান্ত গাছ অবিলম্বে অপসারণ',
    ],
    similarDiseases: ['yellow_stunt_virus', 'rice_blast'],
    spreadMethod: 'সবুজ পাতাফড়িং (Green leafhopper) মাধ্যমে ছড়ায়',
    favorableConditions: 'পাতাফড়িং প্রাচুর্য, তাপমাত্রা ২৮-৩২°C, আউশ মৌসুম',
    districts: ['কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'নোয়াখালী', 'হবিগঞ্জ'],
    seasonality: 'বৈশাখ-জ্যৈষ্ঠ (আউশ মৌসুম)',
  },
  {
    id: 'leaf_scald',
    nameBn: 'লিফ স্কাল্ড রোগ',
    nameEn: 'Leaf Scald',
    causalType: 'fungus',
    causalOrganism: 'Microdochium oryzae',
    affectedCrops: ['rice'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতায় বড় অনিয়মিত বাদামি-লালচে দাগ',
      'দাগের সীমানা স্পষ্ট নয়',
      'পাতার আগা থেকে শুকিয়ে বাদামি হয়ে যায়',
      'আর্দ্র আবহাওয়ায় দাগে সাদা ছত্রাক দেখা যায়',
    ],
    symptomKeywords: ['discolor', 'spots', 'brown', 'red', 'বাদামি', 'লালচে', 'শুকনো'],
    severity: 'medium',
    description: 'পাতায় বড় অনিয়মিত দাগ সৃষ্টি করে। আর্দ্র আবহাওয়ায় বাড়ে। সাধারণত বোরো মৌসুমের শেষে দেখা যায়।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'সুষম সার প্রয়োগ করুন',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
      'আক্রান্ত পাতা অপসারণ করুন',
    ],
    yellowList: [
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'ট্রাইসাইক্লাজোল ৭৫ WP @ ০.৬ গ্রাম/লিটার স্প্রে',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'সুষম সার ব্যবস্থাপনা',
      'ফসল অবশিষ্টাংশ ধ্বংস',
    ],
    similarDiseases: ['rice_blast', 'brown_spot', 'narrow_brown_spot'],
    spreadMethod: 'বাতাসে স্পোর ছড়ায়, বীজ ও ফসল অবশিষ্টাংশ',
    favorableConditions: 'উচ্চ আর্দ্রতা, তাপমাত্রা ২০-২৮°C',
    districts: ['সিলেট', 'হবিগঞ্জ', 'ময়মনসিংহ'],
    seasonality: 'বোরো মৌসুমের শেষভাগ',
  },
  {
    id: 'sheath_blight',
    nameBn: 'শিথ ব্লাইট রোগ',
    nameEn: 'Sheath Blight',
    causalType: 'fungus',
    causalOrganism: 'Rhizoctonia solani',
    affectedCrops: ['rice', 'maize'],
    affectedParts: ['leaf', 'stem'],
    symptoms: [
      'পাতার খোলে (sheath) ডিম্বাকৃতির সবুজ-ধূসর দাগ',
      'দাগ বড় হয়ে পাতার খোল পুরো ঘিরে ফেলে',
      'আক্রান্ত স্থানে সাদা তুলোর মতো ছত্রাক দেখা যায়',
      'গাছের গোড়ার দিকের পাতা শুকিয়ে যায়',
    ],
    symptomKeywords: ['spots', 'discolor', 'rot', 'gray', 'সবুজ-ধূসর', 'খোল', 'শুকনো'],
    severity: 'high',
    description: 'ঘন বপন ও অতিরিক্ত নাইট্রোজেন সারের ফলে বাড়ে। বোরো ধানে বেশি ক্ষতিকারক। মাটি থেকে সংক্রমিত হয়।',
    greenList: [
      'সঠিক দূরত্বে চারা রোপণ করুন (২০×১৫ সেমি)',
      'অতিরিক্ত নাইট্রোজেন সার এড়িয়ে চলুন',
      'ট্রাইকোডারমা জৈব নিয়ন্ত্রণ এজেন্ট ব্যবহার করুন',
      'ফসলের অবশিষ্টাংশ সম্পূর্ণ পুড়ে ফেলুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
    ],
    yellowList: [
      'ভ্যালিডামাইসিন ৩% AS @ ২.৫ মিলি/লিটার পানিতে স্প্রে',
      'হেক্সাকোনাজোল ৫ EC @ ২ মিলি/লিটার পানিতে স্প্রে',
      'রোগ দেখা দিলে প্রতি ১০ দিন অন্তর ২-৩ বার স্প্রে',
    ],
    prevention: [
      'সঠিক বপন দূরত্ব',
      'সুষম সার প্রয়োগ',
      'জৈব নিয়ন্ত্রণ (ট্রাইকোডারমা)',
      'ফসল অবশিষ্টাংশ ধ্বংস',
    ],
    similarDiseases: ['sheath_rot', 'stem_rot'],
    spreadMethod: 'মাটির স্ক্লেরোশিয়া থেকে সংক্রমণ, পানি ও বাতাসে ছড়ায়',
    favorableConditions: 'ঘন বপন, অতিরিক্ত নাইট্রোজেন, উচ্চ আর্দ্রতা, তাপমাত্রা ২৮-৩২°C',
    districts: ['গাজীপুর', 'কিশোরগঞ্জ', 'নরসিংদী', 'মুন্সিগঞ্জ'],
    seasonality: 'বোরো ও আমন মৌসুম',
  },
  {
    id: 'narrow_brown_spot',
    nameBn: 'সরু বাদামি দাগ রোগ',
    nameEn: 'Narrow Brown Leaf Spot',
    causalType: 'fungus',
    causalOrganism: 'Cercospora janseana',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'stem'],
    symptoms: [
      'পাতায় সরু লম্বাটে বাদামি দাগ (২-১০ মিমি লম্বা)',
      'দাগ সমান্তরাল রেখার মতো দেখায়',
      'পাতার দুই পৃষ্ঠেই দাগ থাকে',
      'বয়স্ক পাতায় বেশি দেখা যায়',
    ],
    symptomKeywords: ['spots', 'discolor', 'brown', 'narrow', 'linear', 'বাদামি', 'দাগ', 'সরু'],
    severity: 'low',
    description: 'ধানের পাতায় সরু লম্বাটে বাদামি দাগ সৃষ্টি করে। সাধারণত ফলনে ব্যাপক ক্ষতি করে না, তবে গুরুতর আক্রমণে পাতা শুকিয়ে যেতে পারে। বাদামি গাঁজ রোগের সাথে মিল থাকায় সঠিক নির্ণয় জরুরি।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'সুষম সার প্রয়োগ করুন (পটাশিয়াম নিশ্চিত করুন)',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
      'বীজ শোধন করে বপন করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
    ],
    yellowList: [
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
    ],
    prevention: [
      'প্রতিরোধী জাত নির্বাচন',
      'সুষম সার প্রয়োগ',
      'ফসল অবশিষ্টাংশ ধ্বংস',
      'বীজ শোধন',
    ],
    similarDiseases: ['brown_spot', 'leaf_scald', 'rice_blast'],
    spreadMethod: 'বাতাসে স্পোর ছড়ায়, সংক্রমিত বীজ ও ফসল অবশিষ্টাংশ',
    favorableConditions: 'উচ্চ আর্দ্রতা, তাপমাত্রা ২৫-৩০°C, বয়স্ক গাছ',
    districts: ['ময়মনসিংহ', 'টাঙ্গাইল', 'কিশোরগঞ্জ', 'রংপুর', 'দিনাজপুর'],
    seasonality: 'আউশ ও আমন মৌসুমের শেষভাগ',
  },
  {
    id: 'sheath_rot',
    nameBn: 'শিথ পচা রোগ',
    nameEn: 'Sheath Rot',
    causalType: 'fungus',
    causalOrganism: 'Sarocladium oryzae',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'stem', 'fruit'],
    symptoms: [
      'শীষ আবৃত পাতার খোলে বাদামি পচন দাগ',
      'আক্রান্ত খোলের ভেতর সাদা-গোলাপি ছত্রাক দেখা যায়',
      'শীষ আংশিক বা পুরোপুরি বের হতে পারে না',
      'দানা শূন্য বা অপূর্ণ হয়',
    ],
    symptomKeywords: ['rot', 'discolor', 'brown', 'sheath', 'পচন', 'বাদামি', 'খোল', 'শীষ'],
    severity: 'medium',
    description: 'ধানের শীষ আবৃতকারী পাতার খোলে পচন ধরে। শীষ সঠিকভাবে বের হতে পারে না ও দানা ভরাট হয় না। বোরো ও আমন মৌসুমে ক্ষতি করে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'সঠিক দূরত্বে চারা রোপণ করুন',
      'অতিরিক্ত নাইট্রোজেন সার এড়িয়ে চলুন',
      'ট্রাইকোডারমা জৈব নিয়ন্ত্রণ এজেন্ট ব্যবহার করুন',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
    ],
    yellowList: [
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'ট্রাইসাইক্লাজোল ৭৫ WP @ ০.৬ গ্রাম/লিটার স্প্রে',
      'শীষ বের হওয়ার পর্যায়ে স্প্রে করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত নির্বাচন',
      'সঠিক বপন দূরত্ব',
      'সুষম সার প্রয়োগ',
      'ফসল অবশিষ্টাংশ ধ্বংস',
    ],
    similarDiseases: ['sheath_blight', 'stem_rot', 'brown_spot'],
    spreadMethod: 'বাতাস ও পানির মাধ্যমে স্পোর ছড়ায়, বীজ ও ফসল অবশিষ্টাংশ',
    favorableConditions: 'উচ্চ আর্দ্রতা, ঘন বপন, তাপমাত্রা ২৫-৩২°C',
    districts: ['গাজীপুর', 'কিশোরগঞ্জ', 'ময়মনসিংহ', 'কুমিল্লা', 'বরিশাল'],
    seasonality: 'বোরো ও আমন মৌসুম',
  },
  {
    id: 'stem_rot',
    nameBn: 'কাণ্ড পচা রোগ',
    nameEn: 'Stem Rot',
    causalType: 'fungus',
    causalOrganism: 'Magnaporthe salvinii (Sclerotium oryzae)',
    affectedCrops: ['rice'],
    affectedParts: ['stem', 'leaf', 'root'],
    symptoms: [
      'পাতার খোলে বড় ধূসর-বাদামি দাগ',
      'কাণ্ডের গোড়ায় পচন ধরে',
      'কাণ্ডের ভেতর কালো ছোট গোলাকার স্ক্লেরোশিয়াম দেখা যায়',
      'গাছ হেলে পড়ে (লজিং)',
    ],
    symptomKeywords: ['rot', 'discolor', 'brown', 'wilt', 'পচন', 'বাদামি', 'কালো', 'হেলে পড়া'],
    severity: 'medium',
    description: 'ধানের কাণ্ডে পচন সৃষ্টি করে এবং গাছ হেলে পড়ে। কাণ্ডের ভেতর কালো স্ক্লেরোশিয়াম তৈরি হয় যা মাটিতে দীর্ঘকাল টিকে থাকে। আমন মৌসুমে বেশি ক্ষতি করে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'সুষম সার প্রয়োগ করুন (অতিরিক্ত নাইট্রোজেন এড়িয়ে চলুন)',
      'আক্রান্ত গাছের অবশিষ্টাংশ পুড়ে ফেলুন',
      'জমি গভীরভাবে চাষ দিন (স্ক্লেরোশিয়াম ধ্বংসে)',
    ],
    yellowList: [
      'হেক্সাকোনাজোল ৫ EC @ ২ মিলি/লিটার পানিতে স্প্রে',
      'ভ্যালিডামাইসিন ৩% AS @ ২.৫ মিলি/লিটার পানিতে স্প্রে',
    ],
    prevention: [
      'প্রতিরোধী জাত নির্বাচন',
      'ফসল পর্যায়ক্রম',
      'সুষম সার প্রয়োগ',
      'গভীর চাষ',
      'ফসল অবশিষ্টাংশ ধ্বংস',
    ],
    similarDiseases: ['sheath_blight', 'sheath_rot', 'jute_stem_rot'],
    spreadMethod: 'মাটির স্ক্লেরোশিয়াম থেকে সংক্রমণ, পানি ও বাতাসে ছড়ায়',
    favorableConditions: 'ঘন বপন, অতিরিক্ত নাইট্রোজেন, উচ্চ আর্দ্রতা, তাপমাত্রা ২৮-৩২°C',
    districts: ['ময়মনসিংহ', 'কিশোরগঞ্জ', 'নেত্রকোনা', 'টাঙ্গাইল', 'বরিশাল'],
    seasonality: 'আমন মৌসুম (আষাঢ়-কার্তিক)',
  },
  {
    id: 'yellow_stunt_virus',
    nameBn: 'হলুদ বামন ভাইরাস রোগ',
    nameEn: 'Rice Yellow Stunt Virus',
    causalType: 'virus',
    causalOrganism: 'Rice yellow stunt virus (RYSV)',
    affectedCrops: ['rice'],
    affectedParts: ['leaf', 'whole'],
    symptoms: [
      'পাতা হলুদ হয়ে যায় (বিশেষত নতুন পাতা)',
      'গাছ বামন আকারের হয়',
      'গুল্মমূলী অঙ্কুরোদ্গম দেখা যায়',
      'ফুল আসে না বা অপূর্ণ শীষ হয়',
    ],
    symptomKeywords: ['discolor', 'growth', 'yellow', 'stunt', 'হলুদ', 'বামন', 'বৃদ্ধি বাধা'],
    severity: 'high',
    description: 'সবুজ পাতাফড়িং (Nephotettix spp.) মাধ্যমে ছড়ানো ভাইরাস রোগ। টুংরো রোগের সাথে লক্ষণের মিল থাকায় প্রায়ই ভুল নির্ণয় হয়। আক্রান্ত গাছে ফলন মারাত্মকভাবে কমে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'পাতাফড়িং দমনে হলুদ আঠালো ফাঁদ ব্যবহার করুন',
      'আক্রান্ত গাছ অবিলম্বে উঠিয়ে ধ্বংস করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'আগাম বপন করুন (পাতাফড়িং প্রাচুর্য এড়িয়ে)',
    ],
    yellowList: [
      'পাতাফড়িং দমনে ইমিডাক্লোপ্রিড ২০ SL @ ২ মিলি/লিটার স্প্রে',
      'থায়োমিথক্সাম ২৫ WG @ ০.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'সতর্কতা: ভাইরাসের চিকিৎসা নেই, শুধু বাহক দমন সম্ভব',
    ],
    prevention: [
      'প্রতিরোধী জাত নির্বাচন',
      'পাতাফড়িং দমন',
      'আগাম বপন',
      'ফসল পর্যায়ক্রম',
      'আক্রান্ত গাছ অপসারণ',
    ],
    similarDiseases: ['tungro', 'nutrient_deficiency', 'bacterial_leaf_blight'],
    spreadMethod: 'সবুজ পাতাফড়িং (Green leafhopper) মাধ্যমে ছড়ায়',
    favorableConditions: 'পাতাফড়িং প্রাচুর্য, উষ্ণ আর্দ্র আবহাওয়া, তাপমাত্রা ২৫-৩০°C',
    districts: ['কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'নোয়াখালী', 'সিলেট', 'হবিগঞ্জ'],
    seasonality: 'বৈশাখ-ভাদ্র (আউশ ও আমন মৌসুম)',
  },

  // ─── WHEAT DISEASES ───
  {
    id: 'wheat_rust',
    nameBn: 'পাট মরা রোগ (উইট রাস্ট)',
    nameEn: 'Wheat Rust (Leaf/Stem/Yellow)',
    causalType: 'fungus',
    causalOrganism: 'Puccinia triticina / P. graminis / P. striiformis',
    affectedCrops: ['wheat'],
    affectedParts: ['leaf', 'stem'],
    symptoms: [
      'পাতায় ছোট ছোট মরিচার মতো কমলা-বাদামি দাগ',
      'দাগ ঘষলে গুঁড়ো ওঠে (spores)',
      'পাতা শুকিয়ে মৃত্যু হয়',
      'গাছের বৃদ্ধি বাধাপ্রাপ্ত হয়',
    ],
    symptomKeywords: ['spots', 'discolor', 'orange', 'brown', 'rust', 'কমলা', 'বাদামি', 'মরিচা'],
    severity: 'high',
    description: 'গমের অন্যতম ধ্বংসাত্মক রোগ। মরিচার মতো কমলা-বাদামি গুঁড়ো পাতায় দেখা যায়। শীতের শেষে ও বসন্তে বাড়ে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (বারি গম-২৫, বারি গম-২৬)',
      'সময়মতো বপন করুন (নভেম্বরের ১৫ তারিখের মধ্যে)',
      'সুষম সার প্রয়োগ করুন',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
    ],
    yellowList: [
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'টেবুকোনাজোল ২৫.৯ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'রোগ দেখা দিলে ১৫ দিন পর আবার স্প্রে করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'সময়মতো বপন',
      'সুষম সার',
      'ফসল অবশিষ্টাংশ ধ্বংস',
    ],
    similarDiseases: ['wheat_leaf_blight', 'wheat_powdery_mildew'],
    spreadMethod: 'বাতাসের মাধ্যমে দীর্ঘ দূরত্বে ছড়ায়',
    favorableConditions: 'শীতের শেষে, তাপমাত্রা ১৫-২৫°C, ঘন কুয়াশা',
    districts: ['দিনাজপুর', 'রংপুর', 'বগুড়া', 'রাজশাহী', 'যশোর'],
    seasonality: 'মাঘ-ফাল্গুন (জানুয়ারি-ফেব্রুয়ারি)',
  },
  {
    id: 'wheat_leaf_blight',
    nameBn: 'গমের পাতা পোড়া রোগ',
    nameEn: 'Wheat Leaf Blight / Spot Blotch',
    causalType: 'fungus',
    causalOrganism: 'Bipolaris sorokiniana',
    affectedCrops: ['wheat'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতায় বড় বাদামি-কালচে দাগ',
      'দাগ অনিয়মিত আকৃতির',
      'পাতা শুকিয়ে মারা যায়',
      'উষ্ণ ও আর্দ্র আবহাওয়ায় দ্রুত বাড়ে',
    ],
    symptomKeywords: ['spots', 'discolor', 'brown', 'black', 'wilt', 'বাদামি', 'কালো', 'শুকনো'],
    severity: 'medium',
    description: 'উষ্ণ ও আর্দ্র আবহাওয়ায় গমের পাতায় বড় বাদামি দাগ সৃষ্টি করে। বাংলাদেশের উত্তরাঞ্চলে বেশি দেখা যায়।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'বীজ শোধন করুন',
      'সুষম সার প্রয়োগ করুন',
    ],
    yellowList: [
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার স্প্রে',
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার স্প্রে',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'বীজ শোধন',
    ],
    similarDiseases: ['wheat_rust', 'wheat_powdery_mildew'],
    spreadMethod: 'বাতাস ও বীজ মাধ্যমে ছড়ায়',
    favorableConditions: 'উষ্ণ আর্দ্র আবহাওয়া, ২০-২৮°C',
    districts: ['দিনাজপুর', 'রংপুর', 'বগুড়া'],
    seasonality: 'ফাল্গুন-চৈত্র (ফেব্রুয়ারি-মার্চ)',
  },
  {
    id: 'wheat_powdery_mildew',
    nameBn: 'গমের ছাই রোগ',
    nameEn: 'Wheat Powdery Mildew',
    causalType: 'fungus',
    causalOrganism: 'Blumeria graminis f.sp. tritici',
    affectedCrops: ['wheat'],
    affectedParts: ['leaf', 'stem'],
    symptoms: [
      'পাতায় সাদা ছাইরঙা গুঁড়ো আবরণ',
      'আবরণ পরে ধূসর-কালচে হয়ে যায়',
      'পাতা হলুদ হয়ে শুকিয়ে যায়',
      'গাছের বৃদ্ধি বাধাপ্রাপ্ত হয়',
    ],
    symptomKeywords: ['discolor', 'spots', 'white', 'gray', 'powdery', 'সাদা', 'ছাই', 'গুঁড়ো'],
    severity: 'medium',
    description: 'গমের পাতা ও কাণ্ডে সাদা ছাইরঙা গুঁড়ো আবরণ সৃষ্টি করে। শীতের মাঝামাঝি ও বসন্তে বাড়ে। ঘন বপন ও অতিরিক্ত নাইট্রোজেনে বেশি হয়।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (বারি গম-২৫, বারি গম-২৬)',
      'সময়মতো বপন করুন',
      'সুষম সার প্রয়োগ করুন (অতিরিক্ত নাইট্রোজেন এড়িয়ে চলুন)',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
    ],
    yellowList: [
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'সালফার ৮০ WP @ ৩ গ্রাম/লিটার পানিতে স্প্রে',
      'প্রতি ১৫ দিন অন্তর স্প্রে করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'সময়মতো বপন',
      'সুষম সার',
      'ফসল অবশিষ্টাংশ ধ্বংস',
    ],
    similarDiseases: ['wheat_rust', 'wheat_leaf_blight'],
    spreadMethod: 'বাতাসের মাধ্যমে স্পোর ছড়ায়',
    favorableConditions: 'শীতের মাঝামাঝি, তাপমাত্রা ১৫-২২°C, মাঝারি আর্দ্রতা, ঘন বপন',
    districts: ['দিনাজপুর', 'রংপুর', 'বগুড়া', 'রাজশাহী', 'যশোর'],
    seasonality: 'পৌষ-ফাল্গুন (ডিসেম্বর-ফেব্রুয়ারি)',
  },

  // ─── POTATO DISEASES ───
  {
    id: 'potato_late_blight',
    nameBn: 'আলুর ডাউনি মিলডিউ / লেট ব্লাইট',
    nameEn: 'Potato Late Blight',
    causalType: 'fungus',
    causalOrganism: 'Phytophthora infestans',
    affectedCrops: ['potato', 'tomato'],
    affectedParts: ['leaf', 'stem', 'fruit'],
    symptoms: [
      'পাতায় জলজ বাদামি দাগ (মনে হয় পানিতে ভেজা)',
      'দাগের নিচে সাদা তুলোর মতো ছত্রাক',
      'কাণ্ডে কালচে দাগ',
      'আলুতে শক্ত বাদামি পচন',
    ],
    symptomKeywords: ['spots', 'rot', 'discolor', 'brown', 'wet', 'বাদামি', 'পচন', 'জলজ'],
    severity: 'critical',
    description: 'আলুর সবচেয়ে ধ্বংসাত্মক রোগ। আইরিশ দুর্ভিক্ষের কারণ। শীতে কুয়াশায় দ্রুত ছড়ায়। ৩-৫ দিনে পুরো জমি ধ্বংস করতে পারে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (বারি আলু-৭, বারি আলু-৭৩)',
      'সুস্থ বীজ আলু ব্যবহার করুন',
      'কুয়াশার সময় সেচ কমান',
      'আক্রান্ত গাছ অবিলম্বে অপসারণ করুন',
      'গাছের ডালপালা শুকানো (haulm killing) আলু তোলার ২ সপ্তাহ আগে',
    ],
    yellowList: [
      'মেটাল্যাক্সিল + ম্যানকোজেব ৭২ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে (প্রতিরোধমূলক)',
      'ফসেটাইল-অ্যালুমিনিয়াম ৮০ WP @ ২.৫ গ্রাম/লিটার স্প্রে',
      'প্রতি ৭ দিন অন্তর নিয়মিত স্প্রে করুন',
      'সতর্কতা: ফসল তোলার ১৪ দিন আগে স্প্রে বন্ধ করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'সুস্থ বীজ আলু',
      'সঠিক সেচ ব্যবস্থাপনা',
      'আগাম রোপণ',
      'ফসল পর্যায়ক্রম',
    ],
    similarDiseases: ['potato_early_blight', 'potato_scab'],
    spreadMethod: 'বাতাস, পানি, সংক্রমিত বীজ আলু',
    favorableConditions: 'কুয়াশা, আর্দ্রতা ৯০%+, তাপমাত্রা ১০-২৫°C',
    districts: ['রংপুর', 'দিনাজপুর', 'বগুড়া', 'মুন্সিগঞ্জ', 'কুমিল্লা'],
    seasonality: 'কার্তিক-অগ্রহায়ণ (শীতকাল)',
  },
  {
    id: 'potato_early_blight',
    nameBn: 'আলুর আর্লি ব্লাইট',
    nameEn: 'Potato Early Blight',
    causalType: 'fungus',
    causalOrganism: 'Alternaria solani',
    affectedCrops: ['potato', 'tomato'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতায় গোল বাদামি দাগ, টারগেটের মতো রিং',
      'নিচের পাতা আগে আক্রান্ত হয়',
      'পাতা হলুদ হয়ে শুকিয়ে যায়',
      'দাগ ধীরে ধীরে বড় হয়',
    ],
    symptomKeywords: ['spots', 'discolor', 'brown', 'yellow', 'ring', 'বাদামি', 'রিং', 'হলুদ'],
    severity: 'medium',
    description: 'বয়স্ক গাছে বেশি দেখা যায়। পাতায় টারগেটের মতো সকেন্দ্রিক রিং দাগ সৃষ্টি করে। নিচের পাতা থেকে শুরু হয়।',
    greenList: [
      'সুস্থ বীজ আলু ব্যবহার করুন',
      'পটাশিয়াম সার প্রয়োগ করুন',
      'আক্রান্ত পাতা অপসারণ করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
    ],
    yellowList: [
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার স্প্রে',
      'ক্লোরোথালোনিল ৭৫ WP @ ২ গ্রাম/লিটার স্প্রে',
      'প্রতি ১০-১৪ দিন অন্তর স্প্রে করুন',
    ],
    prevention: [
      'সুস্থ বীজ আলু',
      'সুষম সার',
      'ফসল পর্যায়ক্রম',
      'আক্রান্ত পাতা অপসারণ',
    ],
    similarDiseases: ['potato_late_blight', 'potato_scab'],
    spreadMethod: 'বাতাস, পানি ছিটা, সংক্রমিত বীজ',
    favorableConditions: 'তাপমাত্রা ২০-৩০°C, পর্যায়ক্রমিক আর্দ্রতা',
    districts: ['রাজশাহী', 'বগুড়া', 'পাবনা'],
    seasonality: 'অগ্রহায়ণ-পৌষ',
  },
  {
    id: 'potato_scab',
    nameBn: 'আলুর স্ক্যাব রোগ',
    nameEn: 'Potato Common Scab',
    causalType: 'bacteria',
    causalOrganism: 'Streptomyces scabies',
    affectedCrops: ['potato'],
    affectedParts: ['root', 'fruit'],
    symptoms: [
      'আলুর ত্বকে শক্ত অনিয়মিত খসখসে দাগ',
      'দাগ বাদামি বা কালচে হয়',
      'আলুর উপরিভাগে গর্ত বা উত্থিত দাগ হতে পারে',
      'পাতায় সুস্পষ্ট লক্ষণ দেখা যায় না',
    ],
    symptomKeywords: ['spots', 'deform', 'brown', 'rough', 'বাদামি', 'খসখসে', 'দাগ'],
    severity: 'low',
    description: 'আলুর ত্বকে খসখসে দাগ সৃষ্টি করে। ফলনে ব্যাপক ক্ষতি না হলেও আলুর বাজারমূল্য মারাত্মকভাবে কমে। শুষ্ক ও ক্ষারীয় মাটিতে বেশি হয়।',
    greenList: [
      'সুস্থ বীজ আলু ব্যবহার করুন',
      'আলু রোপণের সময় মাটি ভালোভাবে ভিজিয়ে নিন',
      'ফসল পর্যায়ক্রম মেনে চলুন (কমপক্ষে ৩-৪ বছর)',
      'ক্ষারীয় মাটিতে জিপসাম (চুন) প্রয়োগ এড়িয়ে চলুন',
      'হালকা অম্লীয় মাটিতে (pH ৫.০-৫.৫) আলু চাষ করুন',
    ],
    yellowList: [
      'বীজ আলু শোধন: পেনিসিলিন-স্ট্রেপটোমাইসিন দ্রবণে ডুবিয়ে রাখুন',
      'মাটিতে সালফার প্রয়োগ করুন (মাটির pH কমাতে)',
      'সতর্কতা: অতিরিক্ত সেচ অন্যান্য রোগ বাড়াতে পারে',
    ],
    prevention: [
      'সুস্থ বীজ আলু',
      'ফসল পর্যায়ক্রম',
      'মাটির pH নিয়ন্ত্রণ',
      'সঠিক সেচ ব্যবস্থাপনা',
    ],
    similarDiseases: ['potato_late_blight', 'potato_early_blight'],
    spreadMethod: 'মাটির মাধ্যমে সংক্রমণ, সংক্রমিত বীজ আলু',
    favorableConditions: 'শুষ্ক মাটি, ক্ষারীয় pH (৬.০+), তাপমাত্রা ২০-২৫°C, হালকা বালুমাটি',
    districts: ['রাজশাহী', 'বগুড়া', 'দিনাজপুর', 'পাবনা', 'রংপুর'],
    seasonality: 'কার্তিক-পৌষ (শীতকাল)',
  },

  // ─── JUTE DISEASES ───
  {
    id: 'jute_stem_rot',
    nameBn: 'পাটের কাণ্ড পচা রোগ',
    nameEn: 'Jute Stem Rot',
    causalType: 'fungus',
    causalOrganism: 'Macrophomina phaseolina',
    affectedCrops: ['jute'],
    affectedParts: ['stem', 'root'],
    symptoms: [
      'কাণ্ডের গোড়ায় বাদামি দাগ',
      'কাণ্ড পচে গিয়ে গাছ হেলে পড়ে',
      'ভেতরে কালো ছোট কণা (microsclerotia) দেখা যায়',
      'পাতা হলুদ হয়ে শুকিয়ে যায়',
    ],
    symptomKeywords: ['rot', 'discolor', 'brown', 'wilt', 'পচন', 'বাদামি', 'হলুদ', 'শুকনো'],
    severity: 'high',
    description: 'পাটের অন্যতম ভয়াবহ রোগ। কাণ্ডের গোড়ায় পচন ধরে গাছ হেলে পড়ে। উষ্ণ ও আর্দ্র আবহাওয়ায় দ্রুত বাড়ে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন (ধান-পাট পর্যায়ক্রম)',
      'সুষম সার প্রয়োগ করুন',
      'আক্রান্ত গাছ পুড়ে ফেলুন',
      'মাটিতে জৈব সার ও ট্রাইকোডারমা প্রয়োগ করুন',
    ],
    yellowList: [
      'কার্বেন্ডাজিম ৫০ WP @ ২ গ্রাম/লিটার পানিতে স্প্রে',
      'বীজ শোধন: কার্বেন্ডাজিম @ ২ গ্রাম/কেজি বীজ',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সুষম সার',
      'বীজ শোধন',
    ],
    similarDiseases: ['jute_black_band', 'jute_anthracnose'],
    spreadMethod: 'মাটি ও সংক্রমিত বীজ মাধ্যমে',
    favorableConditions: 'উষ্ণ আর্দ্র, তাপমাত্রা ২৮-৩৫°C, মাটিতে আর্দ্রতা',
    districts: ['ফরিদপুর', 'যশোর', 'কুষ্টিয়া', 'পাবনা', 'রাজশাহী'],
    seasonality: 'বৈশাখ-শ্রাবণ (এপ্রিল-জুলাই)',
  },
  {
    id: 'jute_black_band',
    nameBn: 'পাটের কালো পটি রোগ',
    nameEn: 'Jute Black Band',
    causalType: 'fungus',
    causalOrganism: 'Botryodiplodia theobromae',
    affectedCrops: ['jute'],
    affectedParts: ['stem'],
    symptoms: [
      'কাণ্ডে কালো ব্যান্ড বা পটি দেখা যায়',
      'আক্রান্ত স্থানে কালো আঠালো তরল নির্গত হয়',
      'কাণ্ড দুর্বল হয়ে সহজে ভেঙে পড়ে',
      'পাতা হলুদ হয়ে শুকিয়ে যায়',
    ],
    symptomKeywords: ['discolor', 'rot', 'black', 'wilt', 'কালো', 'পটি', 'ব্যান্ড', 'হলুদ'],
    severity: 'medium',
    description: 'পাটের কাণ্ডে কালো ব্যান্ড সৃষ্টি করে। আক্রান্ত স্থানে আঠালো তরল নির্গত হয়। উষ্ণ ও আর্দ্র আবহাওয়ায় দ্রুত বাড়ে। তুলাটি পাটের চেয়ে বেশি আক্রান্ত হয়।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (তুলাটি পাট)',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'সুষম সার প্রয়োগ করুন',
      'আক্রান্ত গাছ পুড়ে ফেলুন',
      'জমি পরিষ্কার রাখুন',
    ],
    yellowList: [
      'কার্বেন্ডাজিম ৫০ WP @ ২ গ্রাম/লিটার পানিতে স্প্রে',
      'বীজ শোধন: কার্বেন্ডাজিম @ ২ গ্রাম/কেজি বীজ',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সুষম সার',
      'বীজ শোধন',
    ],
    similarDiseases: ['jute_stem_rot', 'jute_anthracnose'],
    spreadMethod: 'মাটি, সংক্রমিত বীজ ও ফসল অবশিষ্টাংশ মাধ্যমে',
    favorableConditions: 'উষ্ণ আর্দ্র, তাপমাত্রা ২৮-৩৫°C, ঘন বপন',
    districts: ['ফরিদপুর', 'যশোর', 'কুষ্টিয়া', 'পাবনা', 'রাজশাহী', 'ঢাকা'],
    seasonality: 'বৈশাখ-শ্রাবণ (এপ্রিল-জুলাই)',
  },
  {
    id: 'jute_anthracnose',
    nameBn: 'পাটের অ্যানথ্রাকনোজ রোগ',
    nameEn: 'Jute Anthracnose',
    causalType: 'fungus',
    causalOrganism: 'Colletotrichum corchori',
    affectedCrops: ['jute'],
    affectedParts: ['leaf', 'stem'],
    symptoms: [
      'পাতায় ছোট গোলাকার বাদামি দাগ',
      'দাগের কেন্দ্র হালকা, কিনারা গাঢ় বাদামি',
      'কাণ্ডে দীর্ঘ বাদামি দাগ',
      'আর্দ্র আবহাওয়ায় দাগে সালামনি-গোলাপি আঠালো স্পোর দেখা যায়',
    ],
    symptomKeywords: ['spots', 'discolor', 'brown', 'rot', 'বাদামি', 'দাগ', 'আঠা', 'গোলাকার'],
    severity: 'medium',
    description: 'পাটের পাতা ও কাণ্ডে বাদামি দাগ সৃষ্টি করে। অ্যানথ্রাকনোজ ছত্রাক আর্দ্র আবহাওয়ায় দ্রুত ছড়ায়। তুলাটি ও দেশী উভয় পাটেই হয়।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'সুষম সার প্রয়োগ করুন',
      'আক্রান্ত গাছের অবশিষ্টাংশ পুড়ে ফেলুন',
      'বীজ শোধন করে বপন করুন',
    ],
    yellowList: [
      'কার্বেন্ডাজিম ৫০ WP @ ২ গ্রাম/লিটার পানিতে স্প্রে',
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সুষম সার',
      'বীজ শোধন',
    ],
    similarDiseases: ['jute_stem_rot', 'jute_black_band'],
    spreadMethod: 'বাতাস ও পানির মাধ্যমে স্পোর ছড়ায়, সংক্রমিত বীজ',
    favorableConditions: 'উষ্ণ আর্দ্র আবহাওয়া, তাপমাত্রা ২৫-৩২°C, বৃষ্টির পানি',
    districts: ['ফরিদপুর', 'যশোর', 'কুষ্টিয়া', 'পাবনা', 'রাজশাহী', 'টাঙ্গাইল'],
    seasonality: 'জ্যৈষ্ঠ-শ্রাবণ (মে-জুলাই)',
  },

  // ─── ONION DISEASES ───
  {
    id: 'onion_purple_blotch',
    nameBn: 'পেঁয়াজের বেগুনি দাগ রোগ',
    nameEn: 'Onion Purple Blotch',
    causalType: 'fungus',
    causalOrganism: 'Alternaria porri',
    affectedCrops: ['onion'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতায় ছোট জলজ দাগ থেকে বেগুনি-বাদামি বড় দাগ',
      'দাগের চারপাশ হলুদ বলয়',
      'পাতা শুকিয়ে মাথা থেকে নিচে ভেঙে পড়ে',
      'আর্দ্র আবহাওয়ায় দাগে কালো ছত্রাক দেখা যায়',
    ],
    symptomKeywords: ['spots', 'discolor', 'purple', 'brown', 'yellow', 'বেগুনি', 'বাদামি', 'হলুদ'],
    severity: 'high',
    description: 'পেঁয়াজের সবচেয়ে ক্ষতিকারক রোগ। পাতায় বেগুনি-বাদামি দাগ সৃষ্টি করে। শীতের শেষে ও বসন্তে বাড়ে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন (কমপক্ষে ৩ বছর)',
      'সঠিক সার ব্যবস্থাপনা (পটাশিয়াম বাড়ান)',
      'আক্রান্ত পাতা অবিলম্বে অপসারণ করুন',
    ],
    yellowList: [
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'হেক্সাকোনাজোল ৫ EC @ ১ মিলি/লিটার স্প্রে',
      'প্রতি ১০ দিন অন্তর স্প্রে করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সুষম সার',
      'আক্রান্ত পাতা অপসারণ',
    ],
    similarDiseases: ['onion_stemphylium', 'onion_downy_mildew'],
    spreadMethod: 'বাতাস, পানি ছিটা, সংক্রমিত বীজ',
    favorableConditions: 'আর্দ্রতা ৭০%+, তাপমাত্রা ২০-৩০°C, ঘন কুয়াশা',
    districts: ['পাবনা', 'রাজশাহী', 'ফরিদপুর', 'ঢাকা', 'ময়মনসিংহ'],
    seasonality: 'কার্তিক-পৌষ (শীতকাল)',
  },
  {
    id: 'onion_stemphylium',
    nameBn: 'পেঁয়াজের স্টেমফাইলিয়াম পাতা পোড়া রোগ',
    nameEn: 'Stemphylium Leaf Blight',
    causalType: 'fungus',
    causalOrganism: 'Stemphylium vesicarium',
    affectedCrops: ['onion'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতায় ছোট হলদে-বাদামি দাগ থেকে বড় হয়',
      'দাগ ধীরে ধীরে গাঢ় বাদামি-কালচে হয়ে যায়',
      'আর্দ্র আবহাওয়ায় দাগে জলজ ভাব দেখা যায়',
      'পাতা শুকিয়ে মাথা থেকে ভেঙে পড়ে',
    ],
    symptomKeywords: ['spots', 'discolor', 'brown', 'yellow', 'black', 'বাদামি', 'কালো', 'হলুদ', 'জলজ'],
    severity: 'high',
    description: 'পেঁয়াজের গুরুতর পাতার রোগ। বেগুনি দাগ রোগের সাথে মিল থাকায় প্রায়ই ভুল নির্ণয় হয়। বাংলাদেশে সম্প্রতি এই রোগের প্রাদুর্ভাব বেড়েছে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন (কমপক্ষে ৩ বছর)',
      'আক্রান্ত পাতা অবিলম্বে অপসারণ করুন',
      'সঠিক সার ব্যবস্থাপনা (পটাশিয়াম বাড়ান)',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
    ],
    yellowList: [
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার স্প্রে',
      'প্রতি ৭-১০ দিন অন্তর স্প্রে করুন',
      'সতর্কতা: বেগুনি দাগ রোগের সাথে মিশ্র সংক্রমণ হলে দুটি ছত্রাকনাশক মিশিয়ে ব্যবহার করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সুষম সার',
      'আক্রান্ত পাতা অপসারণ',
    ],
    similarDiseases: ['onion_purple_blotch', 'onion_downy_mildew'],
    spreadMethod: 'বাতাস ও পানি ছিটার মাধ্যমে স্পোর ছড়ায়',
    favorableConditions: 'আর্দ্রতা ৮০%+, তাপমাত্রা ১৮-২৫°C, ঘন কুয়াশা, শীতের শেষে',
    districts: ['পাবনা', 'রাজশাহী', 'ফরিদপুর', 'ঢাকা', 'ময়মনসিংহ', 'বগুড়া'],
    seasonality: 'কার্তিক-মাঘ (শীতকাল)',
  },
  {
    id: 'onion_downy_mildew',
    nameBn: 'পেঁয়াজের ডাউনি মিলডিউ রোগ',
    nameEn: 'Onion Downy Mildew',
    causalType: 'fungus',
    causalOrganism: 'Peronospora destructor',
    affectedCrops: ['onion'],
    affectedParts: ['leaf', 'seed'],
    symptoms: [
      'পাতায় হলদে-সবুজ দাগ',
      'দাগের নিচে ধূসর-বেগুনি তুলোর মতো ছত্রাক দেখা যায়',
      'পাতা হলুদ হয়ে শুকিয়ে যায়',
      'বীজ ফসলে বিশেষভাবে ক্ষতিকর',
    ],
    symptomKeywords: ['discolor', 'spots', 'yellow', 'gray', 'purple', 'fuzzy', 'হলুদ', 'বেগুনি', 'ধূসর'],
    severity: 'medium',
    description: 'পেঁয়াজের পাতায় ধূসর-বেগুনি ছত্রাক বৃদ্ধি সৃষ্টি করে। শীতের শেষে ও বসন্তে কুয়াশায় দ্রুত ছড়ায়। বীজ উৎপাদনে মারাত্মক ক্ষতি করতে পারে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন (কমপক্ষে ৩ বছর)',
      'সঠিক বপন দূরত্ব বজায় রাখুন (বায়ু চলাচল নিশ্চিত)',
      'আক্রান্ত পাতা অবিলম্বে অপসারণ করুন',
      'বীজ ফসলে আগাম সতর্কতা নিন',
    ],
    yellowList: [
      'মেটাল্যাক্সিল + ম্যানকোজেব ৭২ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'কপার হাইড্রক্সাইড ৭৭ WP @ ২ গ্রাম/লিটার পানিতে স্প্রে (প্রতিরোধমূলক)',
      'প্রতি ৭-১০ দিন অন্তর স্প্রে করুন',
      'সতর্কতা: কপার যৌগ মাটির উর্বরতা কমাতে পারে',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সঠিক বপন দূরত্ব',
      'আক্রান্ত পাতা অপসারণ',
    ],
    similarDiseases: ['onion_purple_blotch', 'onion_stemphylium'],
    spreadMethod: 'বাতাস, পানি ছিটা ও সংক্রমিত বীজ/চারা মাধ্যমে',
    favorableConditions: 'কুয়াশা, আর্দ্রতা ৯০%+, তাপমাত্রা ১০-২০°C, শীতের শেষে',
    districts: ['পাবনা', 'রাজশাহী', 'ফরিদপুর', 'ঢাকা', 'রংপুর'],
    seasonality: 'পৌষ-ফাল্গুন (ডিসেম্বর-ফেব্রুয়ারি)',
  },

  // ─── MUSTARD DISEASES ───
  {
    id: 'mustard_alternaria',
    nameBn: 'সরিষার অল্টারনেরিয়া দাগ রোগ',
    nameEn: 'Mustard Alternaria Blight',
    causalType: 'fungus',
    causalOrganism: 'Alternaria brassicae',
    affectedCrops: ['mustard'],
    affectedParts: ['leaf', 'stem', 'fruit'],
    symptoms: [
      'পাতায় গোল বাদামি দাগ, টারগেটের মতো রিং',
      'কাণ্ডে বাদামি দীর্ঘ দাগ',
      'শলকে (siliqua) কালচে দাগ',
      'বীজ ছোট ও শুকনো হয়',
    ],
    symptomKeywords: ['spots', 'discolor', 'brown', 'black', 'বাদামি', 'কালো', 'দাগ'],
    severity: 'medium',
    description: 'সরিষার পাতা, কাণ্ড ও শলকে বাদামি দাগ সৃষ্টি করে। উৎপাদন ১০-৭০% কমাতে পারে। শীতের শেষে বাড়ে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (বারি সরিষা-১৪, বারি সরিষা-১৫)',
      'সময়মতো বপন করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'বীজ শোধন করুন',
    ],
    yellowList: [
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার স্প্রে',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'সময়মতো বপন',
      'ফসল পর্যায়ক্রম',
      'বীজ শোধন',
    ],
    similarDiseases: ['mustard_white_rust', 'mustard_powdery_mildew'],
    spreadMethod: 'বাতাস, সংক্রমিত বীজ',
    favorableConditions: 'শীতের শেষে, আর্দ্রতা ৮০%+, তাপমাত্রা ১৮-২৫°C',
    districts: ['রাজশাহী', 'যশোর', 'কুষ্টিয়া', 'ফরিদপুর'],
    seasonality: 'পৌষ-ফাল্গুন (ডিসেম্বর-ফেব্রুয়ারি)',
  },
  {
    id: 'mustard_white_rust',
    nameBn: 'সরিষার সাদা মরিচা রোগ',
    nameEn: 'Mustard White Rust',
    causalType: 'fungus',
    causalOrganism: 'Albugo candida',
    affectedCrops: ['mustard'],
    affectedParts: ['leaf', 'stem', 'fruit'],
    symptoms: [
      'পাতার নিচে সাদা চকচকে ফোঁটা বা পুটি দেখা যায়',
      'পাতার উপরে হলুদ দাগ',
      'কাণ্ড ও ফুলের ডাঁটায় মোটা হয়ে যায় (গল গঠন)',
      'আক্রান্ত ফুল বিকৃত হয়ে পাতার মতো দেখায় (ফাইলোডি)',
    ],
    symptomKeywords: ['spots', 'deform', 'white', 'yellow', 'rust', 'সাদা', 'হলুদ', 'মোটা', 'বিকৃতি'],
    severity: 'medium',
    description: 'সরিষার পাতায় সাদা ফোঁটা ও কাণ্ডে গল সৃষ্টি করে। আক্রান্ত ফুল বিকৃত হয়ে বীজ উৎপাদন বাধাগ্রস্ত হয়। শীতের মাঝামাঝি ও বসন্তে বাড়ে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (বারি সরিষা-১৪, বারি সরিষা-১৫)',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'সময়মতো বপন করুন (আগাম বপন এড়িয়ে চলুন)',
      'আক্রান্ত গাছ অবিলম্বে অপসারণ করুন',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
    ],
    yellowList: [
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'মেটাল্যাক্সিল + ম্যানকোজেব ৭২ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'প্রতি ১০-১৫ দিন অন্তর স্প্রে করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সময়মতো বপন',
      'আক্রান্ত গাছ অপসারণ',
    ],
    similarDiseases: ['mustard_alternaria', 'mustard_powdery_mildew'],
    spreadMethod: 'বাতাসের মাধ্যমে স্পোর ছড়ায়, সংক্রমিত বীজ ও ফসল অবশিষ্টাংশ',
    favorableConditions: 'শীতের মাঝামাঝি, আর্দ্রতা ৮০%+, তাপমাত্রা ১২-২০°C, ঘন কুয়াশা',
    districts: ['রাজশাহী', 'যশোর', 'কুষ্টিয়া', 'ফরিদপুর', 'পাবনা', 'বগুড়া'],
    seasonality: 'পৌষ-ফাল্গুন (ডিসেম্বর-ফেব্রুয়ারি)',
  },
  {
    id: 'mustard_powdery_mildew',
    nameBn: 'সরিষার ছাই রোগ',
    nameEn: 'Mustard Powdery Mildew',
    causalType: 'fungus',
    causalOrganism: 'Erysiphe cruciferarum',
    affectedCrops: ['mustard'],
    affectedParts: ['leaf', 'stem', 'fruit'],
    symptoms: [
      'পাতায় সাদা ছাইরঙা গুঁড়ো আবরণ',
      'আবরণ পরে ধূসর হয়ে যায়',
      'পাতা হলুদ হয়ে শুকিয়ে যায়',
      'শলকে (siliqua) ছাই রোগ লাগলে বীজ ছোট হয়',
    ],
    symptomKeywords: ['discolor', 'white', 'gray', 'powdery', 'yellow', 'সাদা', 'ছাই', 'গুঁড়ো', 'হলুদ'],
    severity: 'medium',
    description: 'সরিষার পাতা ও শলকে সাদা গুঁড়ো আবরণ সৃষ্টি করে। শীতের শেষে ও বসন্তে বাড়ে। বীজের ওজন ও তেলের পরিমাণ কমাতে পারে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
      'সময়মতো বপন করুন',
      'আক্রান্ত পাতা অপসারণ করুন',
      'ফসলের অবশিষ্টাংশ পুড়ে ফেলুন',
    ],
    yellowList: [
      'সালফার ৮০ WP @ ৩ গ্রাম/লিটার পানিতে স্প্রে',
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার পানিতে স্প্রে',
      'প্রতি ১০-১৫ দিন অন্তর স্প্রে করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফসল পর্যায়ক্রম',
      'সময়মতো বপন',
      'ফসল অবশিষ্টাংশ ধ্বংস',
    ],
    similarDiseases: ['mustard_alternaria', 'mustard_white_rust'],
    spreadMethod: 'বাতাসের মাধ্যমে স্পোর ছড়ায়',
    favorableConditions: 'শীতের শেষে, তাপমাত্রা ১৫-২৫°C, শুষ্ক আবহাওয়া, মাঝারি আর্দ্রতা',
    districts: ['রাজশাহী', 'যশোর', 'কুষ্টিয়া', 'ফরিদপুর', 'দিনাজপুর', 'রংপুর'],
    seasonality: 'মাঘ-ফাল্গুন (জানুয়ারি-ফেব্রুয়ারি)',
  },

  // ─── MAIZE DISEASES ───
  {
    id: 'maize_northern_leaf_blight',
    nameBn: 'ভুট্টার উত্তর পাতা ব্লাইট',
    nameEn: 'Northern Leaf Blight',
    causalType: 'fungus',
    causalOrganism: 'Exserohilum turcicum',
    affectedCrops: ['maize'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতায় বড় সিগারের মতো ধূসর-সবুজ দাগ',
      'দাগ দীর্ঘ (২.৫-১৫ সেমি)',
      'আর্দ্র আবহাওয়ায় দাগে গাঢ় ধূসর ছত্রাক',
      'নিচের পাতা আগে আক্রান্ত হয়',
    ],
    symptomKeywords: ['spots', 'discolor', 'gray', 'green', 'large', 'ধূসর', 'সবুজ', 'বড়'],
    severity: 'medium',
    description: 'ভুট্টার প্রধান পাতার রোগ। বড় সিগারের মতো দাগ পাতায় দেখা যায়। উৎপাদন ৩০% পর্যন্ত কমাতে পারে।',
    greenList: [
      'প্রতিরোধী জাত/হাইব্রিড ব্যবহার করুন',
      'ফসল অবশিষ্টাংশ পুড়ে ফেলুন',
      'সঠিক বপন সময় মেনে চলুন',
      'সুষম সার প্রয়োগ করুন',
    ],
    yellowList: [
      'ম্যানকোজেব ৬৩ WP @ ২.৫ গ্রাম/লিটার পানিতে স্প্রে',
      'প্রোপিকোনাজোল ২৫ EC @ ১ মিলি/লিটার স্প্রে',
    ],
    prevention: [
      'প্রতিরোধী হাইব্রিড',
      'ফসল অবশিষ্টাংশ ধ্বংস',
      'সঠিক বপন সময়',
    ],
    similarDiseases: ['leaf_scorch', 'nutrient_deficiency'],
    spreadMethod: 'বাতাসে স্পোর, ফসল অবশিষ্টাংশ',
    favorableConditions: 'মাঝারি তাপমাত্রা ১৮-২৭°C, ভারী শিশির',
    districts: ['রংপুর', 'দিনাজপুর', 'বগুড়া', 'লালমনিরহাট'],
    seasonality: 'ভাদ্র-কার্তিক (রবি ভুট্টা)',
  },

  // ─── TOMATO DISEASES ───
  {
    id: 'tomato_leaf_curl',
    nameBn: 'টমেটোর পাতা কুঁচকানো রোগ',
    nameEn: 'Tomato Leaf Curl Virus',
    causalType: 'virus',
    causalOrganism: 'Tomato leaf curl virus (ToLCV)',
    affectedCrops: ['tomato'],
    affectedParts: ['leaf', 'whole'],
    symptoms: [
      'পাতা উপরের দিকে কুঁচকে যায়',
      'পাতা ছোট ও হলুদ হয়',
      'গাছ বামন আকারের হয়',
      'ফুল ও ফল ঝরে পড়ে',
    ],
    symptomKeywords: ['deform', 'discolor', 'growth', 'curl', 'yellow', 'বাঁকা', 'কুঁচকা', 'হলুদ', 'বামন'],
    severity: 'critical',
    description: 'সাদা মাছি (Whitefly/Bemisia tabaci) মাধ্যমে ছড়ানো ভাইরাস রোগ। টমেটোর সবচেয়ে ধ্বংসাত্মক রোগ। একবার আক্রান্ত গাছ থেকে পুরো জমি সংক্রমিত হতে পারে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন',
      'সাদা মাছি দমনে হলুদ আঠালো ফাঁদ ব্যবহার করুন',
      'আক্রান্ত গাছ অবিলম্বে উঠিয়ে ধ্বংস করুন',
      'নার্সারিতে নেট হাউজে চারা উৎপাদন করুন',
      'ফসল পর্যায়ক্রম মেনে চলুন',
    ],
    yellowList: [
      'সাদা মাছি দমনে ইমিডাক্লোপ্রিড ২০ SL @ ২ মিলি/লিটার স্প্রে',
      'থায়োমিথক্সাম ২৫ WG @ ০.৫ গ্রাম/লিটার স্প্রে',
      'নিম্বেক্টিন ০.১৫% @ ৩ মিলি/লিটার স্প্রে (জৈব বিকল্প)',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'নেট হাউজে চারা উৎপাদন',
      'সাদা মাছি দমন',
      'ফসল পর্যায়ক্রম',
      'আক্রান্ত গাছ অপসারণ',
    ],
    similarDiseases: ['nutrient_deficiency', 'leaf_scorch'],
    spreadMethod: 'সাদা মাছি (Whitefly) মাধ্যমে ছড়ায়',
    favorableConditions: 'উষ্ণ ও শুষ্ক আবহাওয়া, সাদা মাছি প্রাচুর্য, ২৫-৩৫°C',
    districts: ['রাজশাহী', 'চাঁপাইনবাবগঞ্জ', 'যশোর', 'কুষ্টিয়া'],
    seasonality: 'কার্তিক-মাঘ (শীতকাল)',
  },

  // ─── BRINJAL DISEASES ───
  {
    id: 'brinjal_fruit_shoot_borer',
    nameBn: 'বেগুনের ফল ও ডগা ছিদ্রকারী পোকা',
    nameEn: 'Brinjal Fruit & Shoot Borer',
    causalType: 'pest',
    causalOrganism: 'Leucinodes orbonalis',
    affectedCrops: ['brinjal'],
    affectedParts: ['fruit', 'stem'],
    symptoms: [
      'ডগায় ছোট গর্ত ও মল দেখা যায়',
      'ফলে গর্ত করে ভেতর খায়',
      'ফলে কালচে মল দেখা যায়',
      'ডগা শুকিয়ে মারা যায়',
    ],
    symptomKeywords: ['pest_damage', 'holes', 'rot', 'গর্ত', 'পোকা', 'মল', 'শুকনো'],
    severity: 'high',
    description: 'বেগুনের সবচেয়ে ক্ষতিকারক পোকা। ডগা ও ফলে গর্ত করে ভেতর খায়। ৫০-৯০% ফসল নষ্ট করতে পারে।',
    greenList: [
      'প্রতিরোধী জাত ব্যবহার করুন (বারি বেগুন-১, বারি বেগুন-৮)',
      'ফেরোমন ফাঁদ ব্যবহার করুন',
      'আক্রান্ত ডগা ও ফল নিয়মিত অপসারণ করুন',
      'জালের ব্যাগ ফলে পরান (fruit bagging)',
      'নিম তেল @ ৫ মিলি/লিটার স্প্রে করুন',
    ],
    yellowList: [
      'কার্বারিল ৮৫ WP @ ২ গ্রাম/লিটার স্প্রে',
      'সাইপারমেথরিন ১০ EC @ ১ মিলি/লিটার স্প্রে',
      'ফল ধরার পর ১০ দিন অন্তর স্প্রে করুন',
      'সতর্কতা: ফল তোলার ৭ দিন আগে স্প্রে বন্ধ করুন',
    ],
    prevention: [
      'প্রতিরোধী জাত',
      'ফেরোমন ফাঁদ',
      'নিয়মিত আক্রান্ত অংশ অপসারণ',
      'ফল ব্যাগিং',
      'ফসল পর্যায়ক্রম',
    ],
    similarDiseases: ['nutrient_deficiency'],
    spreadMethod: 'প্রাপ্তবয়স্ক পোকা ডিম পাড়ে, শুককীট গর্ত করে',
    favorableConditions: 'উষ্ণ ও আর্দ্র, ২৫-৩৫°C',
    districts: ['সারা বাংলাদেশ'],
    seasonality: 'সারা বছর, বর্ষায় বেশি',
  },

  // ─── ABIOTIC / ENVIRONMENTAL ───
  {
    id: 'leaf_scorch',
    nameBn: 'শুষ্ক পাতা পোড়া (পরিবেশজনিত)',
    nameEn: 'Leaf Scorch (Abiotic)',
    causalType: 'abiotic',
    causalOrganism: 'পানির অভাব / লবণাক্ততা / তাপ চাপ',
    affectedCrops: ['rice', 'wheat', 'maize', 'jute', 'mustard', 'onion', 'potato', 'tomato', 'brinjal'],
    affectedParts: ['leaf'],
    symptoms: [
      'পাতার আগা থেকে শুকিয়ে বাদামি হয়ে যায়',
      'পাতার কিনারা বাদামি হয়',
      'কোনো ছত্রাক বা পোকার চিহ্ন নেই',
      'মাটি শুষ্ক বা লবণাক্ত',
    ],
    symptomKeywords: ['discolor', 'wilt', 'brown', 'dry', 'শুকনো', 'বাদামি', 'পোড়া'],
    severity: 'medium',
    description: 'পরিবেশগত কারণে পাতা শুকিয়ে যায়। পানির অভাব, লবণাক্ততা, অতিরিক্ত তাপ, বা পুষ্টির অভাবে হতে পারে। কোনো জীবাণু জড়িত নয়।',
    greenList: [
      'নিয়মিত সেচ নিশ্চিত করুন',
      'মাটির লবণাক্ততা পরীক্ষা করুন',
      'জৈব সার দিয়ে মাটির গুণমান উন্নত করুন',
      'মালচিং (খড়/পাতা ঢেকে) দিয়ে মাটির আর্দ্রতা ধরে রাখুন',
      'ছায়াযুক্ত জায়গায় চারা রাখুন',
      'সকালে সেচ দিন (বাষ্পীভবন কমাতে)',
    ],
    yellowList: [
      'লবণাক্ততার ক্ষেত্রে: জিপসাম (চুন) প্রয়োগ করুন মাটিতে',
      'পুষ্টির অভাবে: সুষম সার প্রয়োগ করুন',
      'ক্যালসিয়াম সালফেট প্রয়োগ (লবণাক্ততা কমাতে)',
    ],
    prevention: [
      'নিয়মিত সেচ',
      'মালচিং',
      'মাটির গুণমান উন্নত',
      'লবণাক্ততা পরীক্ষা',
      'উপযুক্ত জাত নির্বাচন',
    ],
    similarDiseases: ['rice_blast', 'brown_spot', 'wheat_leaf_blight'],
    spreadMethod: 'সংক্রামক নয় — পরিবেশগত কারণ',
    favorableConditions: 'খরা, লবণাক্ত মাটি, অতিরিক্ত তাপমাত্রা, সেচের অভাব',
    districts: ['সারা বাংলাদেশ (বিশেষত উপকূলীয় এলাকা)'],
    seasonality: 'বৈশাখ-জ্যৈষ্ঠ (গ্রীষ্মকাল)',
  },
  {
    id: 'nutrient_deficiency',
    nameBn: 'পুষ্টির অভাবজনিত সমস্যা',
    nameEn: 'Nutrient Deficiency',
    causalType: 'abiotic',
    causalOrganism: 'নাইট্রোজেন/পটাশিয়াম/ফসফরাস/জিংকের অভাব',
    affectedCrops: ['rice', 'wheat', 'maize', 'jute', 'mustard', 'onion', 'potato', 'tomato', 'brinjal', 'sugarcane', 'cotton', 'lentil'],
    affectedParts: ['leaf', 'whole'],
    symptoms: [
      'পাতা হলুদ হয়ে যায় (নাইট্রোজেনের অভাব)',
      'পাতায় কালচে-সবুজ/বাদামি দাগ (পটাশিয়ামের অভাব)',
      'পাতা ছোট ও গাঢ় সবুজ, বৃদ্ধি বাধা (ফসফরাসের অভাব)',
      'পাতায় সাদা দাগ, আগা মরে যায় (জিংকের অভাব)',
    ],
    symptomKeywords: ['discolor', 'growth', 'yellow', 'stunt', 'হলুদ', 'বামন', 'বৃদ্ধি'],
    severity: 'medium',
    description: 'মাটিতে পুষ্টির অভাবে গাছের বৃদ্ধি বাধাগ্রস্ত হয়। বাংলাদেশের মাটিতে সাধারণত নাইট্রোজেন, পটাশিয়াম, ফসফরাস ও জিংকের অভাব দেখা যায়।',
    greenList: [
      'মাটি পরীক্ষা করুন (স্থানীয় কৃষি অফিসে)',
      'জৈব সার (গোবর সার, কম্পোস্ট) প্রয়োগ করুন',
      'সবুজ সার (ঢৈঞ্চা, শন) চাষ করুন',
      'ফসলের অবশিষ্টাংশ মাটিতে মিশিয়ে দিন',
      'ভার্মিকম্পোস্ট ব্যবহার করুন',
    ],
    yellowList: [
      'মাটি পরীক্ষার রিপোর্ট অনুযায়ী সার প্রয়োগ করুন',
      'নাইট্রোজেন: ইউরিয়া সার (প্রয়োজন অনুযায়ী)',
      'পটাশিয়াম: এমওপি সার',
      'ফসফরাস: টিএসপি সার',
      'জিংক: জিংক সালফেট @ ৩-৫ কেজি/হেক্টর',
      'সতর্কতা: অতিরিক্ত সার মাটির উর্বরতা কমাতে পারে',
    ],
    prevention: [
      'নিয়মিত মাটি পরীক্ষা',
      'সুষম সার প্রয়োগ',
      'জৈব সার ব্যবহার',
      'ফসল পর্যায়ক্রম',
    ],
    similarDiseases: ['leaf_scorch', 'tungro', 'brown_spot'],
    spreadMethod: 'সংক্রামক নয় — পুষ্টির অভাব',
    favorableConditions: 'পুষ্টিহীন মাটি, অমৌলিক সার ব্যবহার, একই ফসল বারবার চাষ',
    districts: ['সারা বাংলাদেশ'],
    seasonality: 'সারা বছর',
  },
]

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/** Get diseases matching a specific crop */
export function getDiseasesByCrop(cropId: string): DiseaseEntry[] {
  return DISEASE_DB.filter(d => d.affectedCrops.includes(cropId))
}

/** Get diseases matching a specific plant part */
export function getDiseasesByPart(part: PlantPart): DiseaseEntry[] {
  return DISEASE_DB.filter(d => d.affectedParts.includes(part))
}

/** Get diseases matching crop + plant part + symptom keywords */
export function matchDiseases(
  cropId: string,
  plantPart: PlantPart,
  symptomId: string
): DiseaseEntry[] {
  const symptom = SYMPTOM_TYPES.find(s => s.id === symptomId)
  const keywords = symptom?.keywords || []

  return DISEASE_DB
    .filter(d => {
      const matchesCrop = d.affectedCrops.includes(cropId)
      const matchesPart = d.affectedParts.includes(plantPart)
      if (!matchesCrop || !matchesPart) return false

      if (symptomId === 'not_sure') return true

      // Check if any symptom keyword matches
      const matchesSymptom = keywords.some(kw =>
        d.symptomKeywords.some(sk => sk.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(sk.toLowerCase()))
      ) || d.symptoms.some(s =>
        keywords.some(kw => s.toLowerCase().includes(kw.toLowerCase()))
      )

      return matchesSymptom
    })
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
}

/** Get a specific disease by ID */
export function getDiseaseById(id: string): DiseaseEntry | undefined {
  return DISEASE_DB.find(d => d.id === id)
}

/** Get similar diseases for comparison */
export function getSimilarDiseases(diseaseId: string): DiseaseEntry[] {
  const disease = getDiseaseById(diseaseId)
  if (!disease) return []
  return disease.similarDiseases
    .map(id => getDiseaseById(id))
    .filter((d): d is DiseaseEntry => d !== undefined)
}

/** Calculate match confidence based on how many criteria match */
export function calculateConfidence(
  disease: DiseaseEntry,
  cropId: string,
  plantPart: PlantPart,
  symptomId: string
): number {
  let score = 0
  let maxScore = 0

  // Crop match (weight: 30)
  maxScore += 30
  if (disease.affectedCrops.includes(cropId)) score += 30

  // Plant part match (weight: 25)
  maxScore += 25
  if (disease.affectedParts.includes(plantPart)) score += 25

  // Symptom keyword match (weight: 35)
  maxScore += 35
  if (symptomId !== 'not_sure') {
    const symptom = SYMPTOM_TYPES.find(s => s.id === symptomId)
    const keywords = symptom?.keywords || []
    const hasMatch = keywords.some(kw =>
      disease.symptomKeywords.some(sk => sk.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(sk.toLowerCase()))
    )
    if (hasMatch) score += 35
  } else {
    score += 15 // "not sure" gives partial credit
  }

  // Severity bonus (weight: 10) - common diseases get slight boost
  maxScore += 10
  score += 10

  return Math.round((score / maxScore) * 100)
}

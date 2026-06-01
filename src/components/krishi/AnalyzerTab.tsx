'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Upload, Scan, Leaf, AlertTriangle, CheckCircle, Clock, Trash2, X,
  ChevronRight, ChevronLeft, Bug, Shield, FlaskConical, Sprout, MapPin,
  Thermometer, Droplets, ShieldCheck, AlertCircle, Info, Eye, BookOpen,
  ArrowRight, RotateCcw, Microscope, LeafyGreen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useKrishiStore, type ScanResult } from '@/lib/krishi-store'
import {
  CROP_LIST, PLANT_PARTS, SYMPTOM_TYPES, CAUSAL_TYPE_LABELS,
  type PlantPart, type CausalType, type SeverityLevel,
} from '@/lib/disease-db'
import { toast } from '@/hooks/use-toast'

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

type DiagnosisStep = 'crop' | 'part' | 'symptom' | 'photo' | 'analyzing' | 'results'

const severityLabels: Record<SeverityLevel, string> = {
  low: 'হালকা',
  medium: 'মাঝারি',
  high: 'মারাত্মক',
  critical: 'সংকটাপন্ন',
}

const severityIcons: Record<SeverityLevel, string> = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  critical: '🔴',
}

const STEPS = [
  { id: 'crop', label: 'ফসল', icon: Sprout },
  { id: 'part', label: 'অংশ', icon: Leaf },
  { id: 'symptom', label: 'লক্ষণ', icon: Eye },
  { id: 'photo', label: 'ছবি', icon: Camera },
  { id: 'results', label: 'ফলাফল', icon: CheckCircle },
] as const

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function AnalyzerTab() {
  const { scanHistory, addScanResult, isAnalyzing, setIsAnalyzing, clearScanHistory } = useKrishiStore()

  // Diagnosis flow state
  const [step, setStep] = useState<DiagnosisStep>('crop')
  const [selectedCrop, setSelectedCrop] = useState<string>('')
  const [selectedPart, setSelectedPart] = useState<PlantPart | ''>('')
  const [selectedSymptom, setSelectedSymptom] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMime, setImageMime] = useState<string>('image/jpeg')
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResponse | null>(null)
  const [expandedDisease, setExpandedDisease] = useState<string | null>(null)
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<Record<string, 'green' | 'yellow'>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Image compression ──────────────────────────────────────────────────
  const compressImage = useCallback((file: File): Promise<{ base64: string; mime: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const MAX = 1024
          let { width, height } = img
          if (width > MAX || height > MAX) {
            const ratio = Math.min(MAX / width, MAX / height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          const quality = file.size > 1024 * 1024 ? 0.7 : 0.85
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          const base64 = dataUrl.split(',')[1]
          resolve({ base64, mime: 'image/jpeg' })
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'ত্রুটি', description: 'শুধুমাত্র ছবি ফাইল আপলোড করুন' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'ত্রুটি', description: 'ছবি ৫MB এর বেশি হতে পারবে না' })
      return
    }
    try {
      const { base64, mime } = await compressImage(file)
      setImagePreview(URL.createObjectURL(file))
      setImageBase64(base64)
      setImageMime(mime)
    } catch {
      toast({ title: 'ত্রুটি', description: 'ছবি প্রসেস করতে সমস্যা হয়েছে' })
    }
  }, [compressImage])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    e.target.value = ''
  }, [handleFileSelect])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const clearImage = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setImageBase64(null)
  }, [imagePreview])

  // ─── Run diagnosis ──────────────────────────────────────────────────────
  const runDiagnosis = useCallback(async () => {
    if (!selectedCrop || !selectedPart) return

    setStep('analyzing')
    setIsAnalyzing(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropId: selectedCrop,
          plantPart: selectedPart,
          symptomId: selectedSymptom || 'not_sure',
          image: imageBase64,
          mimeType: imageMime,
        }),
      })

      if (!res.ok) throw new Error('Analysis failed')

      const data: DiagnosisResponse = await res.json()
      setDiagnosisResult(data)

      // Save first disease to scan history
      if (data.matchedDiseases.length > 0) {
        const top = data.matchedDiseases[0]
        const scan: ScanResult = {
          id: Date.now().toString(),
          imageUrl: imagePreview || '',
          disease: top.nameBn,
          severity: top.severity,
          confidence: top.confidence,
          diagnosis: top.description,
          treatment: [...top.greenList.slice(0, 2), ...top.yellowList.slice(0, 1)].join('\n'),
          timestamp: Date.now(),
          cropId: selectedCrop,
          plantPart: selectedPart,
          causalType: top.causalType,
          diagnosisMethod: data.diagnosisMethod,
        }
        addScanResult(scan)
      }

      setStep('results')
    } catch {
      toast({ title: 'ত্রুটি', description: 'বিশ্লেষণে সমস্যা হয়েছে, আবার চেষ্টা করুন' })
      setStep('photo')
    } finally {
      setIsAnalyzing(false)
    }
  }, [selectedCrop, selectedPart, selectedSymptom, imageBase64, imageMime, imagePreview, setIsAnalyzing, addScanResult])

  // ─── Reset everything ──────────────────────────────────────────────────
  const resetDiagnosis = useCallback(() => {
    setStep('crop')
    setSelectedCrop('')
    setSelectedPart('')
    setSelectedSymptom('')
    clearImage()
    setDiagnosisResult(null)
    setExpandedDisease(null)
    setActiveTreatmentTab({})
  }, [clearImage])

  // ─── Step navigation helpers ──────────────────────────────────────────
  const currentStepIndex = STEPS.findIndex(s => s.id === step.replace('analyzing', 'photo'))
  const goBack = () => {
    if (step === 'results') { setStep('photo'); return }
    if (step === 'photo') { setStep('symptom'); return }
    if (step === 'symptom') { setStep('part'); return }
    if (step === 'part') { setStep('crop'); return }
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
  }

  // ─── RENDER ────────────────────────────────────────────────────────────
  return (
    <div className="page-content p-4 space-y-4 custom-scroll">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-krishi-green/10 flex items-center justify-center">
          <Microscope className="w-5 h-5 text-krishi-green" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">ফসল বিশ্লেষক</h2>
          <p className="text-xs text-muted-foreground">CABI Plantwise পদ্ধতিতে রোগ নির্ণয়</p>
        </div>
      </div>

      {/* Step Progress Bar (only show during diagnosis flow) */}
      {step !== 'analyzing' && (
        <div className="flex items-center gap-1 px-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = i === currentStepIndex
            const isCompleted = i < currentStepIndex || step === 'results'
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-krishi-green/10 text-krishi-green' :
                  isCompleted ? 'bg-krishi-green/5 text-krishi-green' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className={`w-3 h-3 mx-0.5 ${isCompleted ? 'text-krishi-green' : 'text-muted-foreground/50'}`} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* ─── STEP 1: Crop Selection ──────────────────────────────────── */}
        {step === 'crop' && (
          <motion.div key="crop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="w-5 h-5 text-krishi-green" />
              <h3 className="text-base font-semibold">কোন ফসলে সমস্যা?</h3>
            </div>
            <p className="text-xs text-muted-foreground">আপনার আক্রান্ত ফসলটি নির্বাচন করুন (CABI পদ্ধতি: ধাপ ১/৫)</p>

            <div className="grid grid-cols-3 gap-2">
              {CROP_LIST.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`mat-card elevation-1 flex flex-col items-center gap-1.5 p-3 transition-all ${
                    selectedCrop === crop.id
                      ? 'ring-2 ring-krishi-green bg-krishi-green/5'
                      : 'hover:bg-krishi-green/[0.02]'
                  }`}
                >
                  <span className="text-2xl">{crop.icon}</span>
                  <span className="text-xs font-medium">{crop.nameBn}</span>
                </button>
              ))}
            </div>

            {selectedCrop && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Button
                  onClick={() => setStep('part')}
                  className="w-full h-11 bg-gradient-to-r from-krishi-green-dark to-krishi-green text-white font-semibold rounded-xl"
                >
                  পরবর্তী ধাপ <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ─── STEP 2: Plant Part Selection ────────────────────────────── */}
        {step === 'part' && (
          <motion.div key="part" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-krishi-green" />
              <h3 className="text-base font-semibold">গাছের কোন অংশ আক্রান্ত?</h3>
            </div>
            <p className="text-xs text-muted-foreground">আক্রান্ত অংশ নির্বাচন করুন (CABI পদ্ধতি: ধাপ ২/৫)</p>

            <div className="grid grid-cols-2 gap-2">
              {PLANT_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part.id)}
                  className={`mat-card elevation-1 flex items-center gap-3 p-3 transition-all ${
                    selectedPart === part.id
                      ? 'ring-2 ring-krishi-green bg-krishi-green/5'
                      : 'hover:bg-krishi-green/[0.02]'
                  }`}
                >
                  <span className="text-xl">{part.icon}</span>
                  <span className="text-sm font-medium">{part.nameBn}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={goBack} className="flex-1 h-10 rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-1" /> পেছনে
              </Button>
              {selectedPart && (
                <Button
                  onClick={() => setStep('symptom')}
                  className="flex-1 h-10 bg-gradient-to-r from-krishi-green-dark to-krishi-green text-white font-semibold rounded-xl"
                >
                  পরবর্তী <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── STEP 3: Symptom Selection ───────────────────────────────── */}
        {step === 'symptom' && (
          <motion.div key="symptom" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-krishi-green" />
              <h3 className="text-base font-semibold">কী ধরনের লক্ষণ দেখছেন?</h3>
            </div>
            <p className="text-xs text-muted-foreground">লক্ষণের ধরন নির্বাচন করুন (CABI পদ্ধতি: ধাপ ৩/৫)</p>

            <div className="space-y-2">
              {SYMPTOM_TYPES.map((sym) => (
                <button
                  key={sym.id}
                  onClick={() => setSelectedSymptom(sym.id)}
                  className={`w-full mat-card elevation-1 flex items-center gap-3 p-3 text-left transition-all ${
                    selectedSymptom === sym.id
                      ? 'ring-2 ring-krishi-green bg-krishi-green/5'
                      : 'hover:bg-krishi-green/[0.02]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    selectedSymptom === sym.id ? 'bg-krishi-green text-white' : 'bg-krishi-green/10 text-krishi-green'
                  }`}>
                    {sym.id === 'discolor' ? <Droplets className="w-4 h-4" /> :
                     sym.id === 'spots' ? <AlertCircle className="w-4 h-4" /> :
                     sym.id === 'rot' ? <Bug className="w-4 h-4" /> :
                     sym.id === 'wilt' ? <Thermometer className="w-4 h-4" /> :
                     sym.id === 'deform' ? <LeafyGreen className="w-4 h-4" /> :
                     sym.id === 'pest_damage' ? <Bug className="w-4 h-4" /> :
                     sym.id === 'growth' ? <Sprout className="w-4 h-4" /> :
                     <Info className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium">{sym.nameBn}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={goBack} className="flex-1 h-10 rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-1" /> পেছনে
              </Button>
              {selectedSymptom && (
                <Button
                  onClick={() => setStep('photo')}
                  className="flex-1 h-10 bg-gradient-to-r from-krishi-green-dark to-krishi-green text-white font-semibold rounded-xl"
                >
                  পরবর্তী <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── STEP 4: Photo Upload ────────────────────────────────────── */}
        {step === 'photo' && (
          <motion.div key="photo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-krishi-green" />
              <h3 className="text-base font-semibold">ছবি যোগ করুন (ঐচ্ছিক)</h3>
            </div>
            <p className="text-xs text-muted-foreground">ছবি দিলে নির্ভুলতা বাড়ে — AI ভিশন + লক্ষণ মিলিয়ে সঠিক রোগ নির্ণয়</p>

            {/* Summary of selections */}
            <div className="mat-card elevation-1 flex flex-wrap gap-2 p-3">
              <Badge className="bg-krishi-green/10 text-krishi-green border-0 text-xs">
                <Sprout className="w-3 h-3 mr-1" />
                {CROP_LIST.find(c => c.id === selectedCrop)?.nameBn || selectedCrop}
              </Badge>
              <Badge className="bg-krishi-sky/10 text-krishi-sky border-0 text-xs">
                <Leaf className="w-3 h-3 mr-1" />
                {PLANT_PARTS.find(p => p.id === selectedPart)?.nameBn || selectedPart}
              </Badge>
              <Badge className="bg-krishi-amber/10 text-krishi-amber border-0 text-xs">
                <Eye className="w-3 h-3 mr-1" />
                {SYMPTOM_TYPES.find(s => s.id === selectedSymptom)?.nameBn || 'নির্বাচিত'}
              </Badge>
            </div>

            {/* Upload area */}
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="mat-card elevation-1 border-2 border-dashed border-krishi-green/30 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-krishi-green/50 hover:bg-krishi-green/[0.02] transition-all min-h-[160px]"
              >
                <div className="w-12 h-12 rounded-full bg-krishi-green/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-krishi-green" />
                </div>
                <p className="text-sm font-medium text-foreground">ছবি তুলুন বা আপলোড করুন</p>
                <p className="text-xs text-muted-foreground">JPG, PNG - সর্বোচ্চ ৫MB</p>
                <div className="flex items-center gap-1 mt-1">
                  <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">ড্র্যাগ & ড্রপ বা ক্লিক</span>
                </div>
              </div>
            ) : (
              <div className="mat-card elevation-1 space-y-3">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="আপলোড করা ছবি" className="w-full h-44 object-cover rounded-xl" />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <Badge className="absolute bottom-2 left-2 bg-krishi-green/90 text-white border-0 text-[10px]">
                    <CheckCircle className="w-3 h-3 mr-1" /> AI বিশ্লেষণ সক্রিয়
                  </Badge>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="hidden"
            />

            <div className="flex gap-2">
              <Button variant="outline" onClick={goBack} className="flex-1 h-10 rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-1" /> পেছনে
              </Button>
              <Button
                onClick={runDiagnosis}
                disabled={isAnalyzing}
                className="flex-1 h-11 bg-gradient-to-r from-krishi-green-dark to-krishi-green text-white font-semibold rounded-xl"
              >
                <Scan className="w-4 h-4 mr-1" />
                নির্ণয় শুরু করুন
              </Button>
            </div>

            {!imagePreview && (
              <button
                onClick={runDiagnosis}
                disabled={isAnalyzing}
                className="w-full text-xs text-muted-foreground hover:text-krishi-green transition-colors py-1"
              >
                ছবি ছাড়াই শুধু লক্ষণ দিয়ে নির্ণয় করুন →
              </button>
            )}
          </motion.div>
        )}

        {/* ─── ANALYZING STATE ──────────────────────────────────────────── */}
        {step === 'analyzing' && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-krishi-green/10 flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-krishi-green border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-foreground">CABI পদ্ধতিতে বিশ্লেষণ হচ্ছে</h3>
                <p className="text-xs text-muted-foreground">লক্ষণ মিলানো + AI ভিশন বিশ্লেষণ</p>
              </div>

              <div className="w-full max-w-xs space-y-2">
                {['ফসল ও লক্ষণ মিলানো হচ্ছে', 'রোগ ডাটাবেজ অনুসন্ধান', 'AI ভিশন বিশ্লেষণ', 'ফলাফল প্রস্তুত করা হচ্ছে'].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full border-2 border-krishi-green/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-krishi-green animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    </div>
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 5: Results ──────────────────────────────────────────── */}
        {step === 'results' && diagnosisResult && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Advisory Note */}
            <div className={`mat-card elevation-2 p-3 border-l-4 ${
              diagnosisResult.matchedDiseases[0]?.severity === 'critical' ? 'border-l-krishi-red' :
              diagnosisResult.matchedDiseases[0]?.severity === 'high' ? 'border-l-krishi-amber' :
              'border-l-krishi-green'
            }`}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-krishi-green shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{diagnosisResult.advisoryNote}</p>
              </div>
            </div>

            {/* Method Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-krishi-green/10 text-krishi-green border-0 text-[10px]">
                {diagnosisResult.diagnosisMethod === 'combined' ? '🤖 AI + 📋 লক্ষণ মিল' :
                 diagnosisResult.diagnosisMethod === 'ai_vision' ? '🤖 AI ভিশন' :
                 '📋 লক্ষণ ভিত্তিক'}
              </Badge>
              <Badge className="bg-krishi-sky/10 text-krishi-sky border-0 text-[10px]">
                {diagnosisResult.totalMatches}টি রোগ মিলেছে
              </Badge>
            </div>

            {/* Disease Cards */}
            {diagnosisResult.matchedDiseases.map((disease, idx) => (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                rank={idx + 1}
                isExpanded={expandedDisease === disease.id}
                onToggle={() => setExpandedDisease(expandedDisease === disease.id ? null : disease.id)}
                activeTab={activeTreatmentTab[disease.id] || 'green'}
                onTabChange={(tab) => setActiveTreatmentTab(prev => ({ ...prev, [disease.id]: tab }))}
              />
            ))}

            {/* New Analysis Button */}
            <Button
              onClick={resetDiagnosis}
              variant="outline"
              className="w-full h-10 rounded-xl border-krishi-green/30 text-krishi-green hover:bg-krishi-green/5"
            >
              <RotateCcw className="w-4 h-4 mr-1" /> নতুন বিশ্লেষণ
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scan History ──────────────────────────────────────────────── */}
      {step === 'crop' && (
        <div className="space-y-2 mt-4">
          <Separator />
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">বিশ্লেষণের ইতিহাস</h3>
            </div>
            {scanHistory.length > 0 && (
              <button onClick={clearScanHistory} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-krishi-red transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                মুছুন
              </button>
            )}
          </div>

          {scanHistory.length === 0 ? (
            <div className="mat-card elevation-1 py-6 flex flex-col items-center gap-2 text-center">
              <Leaf className="w-7 h-7 text-krishi-green/30" />
              <p className="text-sm text-muted-foreground">এখনো কোনো বিশ্লেষণ নেই</p>
              <p className="text-xs text-muted-foreground/60">ফসল নির্বাচন করে শুরু করুন</p>
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto custom-scroll space-y-1.5">
              {scanHistory.slice(0, 8).map((scan) => (
                <div key={scan.id} className="mat-card elevation-1 flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-krishi-green/10 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-krishi-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-foreground truncate">{scan.disease}</p>
                      <Badge className={`severity-${scan.severity} text-[9px] px-1 py-0 border-0`}>
                        {severityLabels[scan.severity]}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{scan.confidence}% • {formatTime(scan.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── DISEASE CARD COMPONENT ──────────────────────────────────────────────────

function DiseaseCard({
  disease,
  rank,
  isExpanded,
  onToggle,
  activeTab,
  onTabChange,
}: {
  disease: DiagnosisDisease
  rank: number
  isExpanded: boolean
  onToggle: () => void
  activeTab: 'green' | 'yellow'
  onTabChange: (tab: 'green' | 'yellow') => void
}) {
  const causalInfo = CAUSAL_TYPE_LABELS[disease.causalType]

  return (
    <motion.div
      layout
      className={`mat-card elevation-2 space-y-3 transition-all ${rank === 1 ? 'ring-1 ring-krishi-green/30' : ''}`}
    >
      {/* Header */}
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-muted-foreground">#{rank}</span>
              <span className="text-sm">{severityIcons[disease.severity]}</span>
              <h4 className="text-base font-bold text-foreground">{disease.nameBn}</h4>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground italic">{disease.nameEn}</span>
              <Badge
                className="text-[9px] border-0 px-1.5 py-0"
                style={{ color: causalInfo.color, background: `${causalInfo.color}15` }}
              >
                {disease.causalType === 'pest' ? <Bug className="w-2.5 h-2.5 mr-0.5" /> :
                 disease.causalType === 'abiotic' ? <Thermometer className="w-2.5 h-2.5 mr-0.5" /> :
                 <FlaskConical className="w-2.5 h-2.5 mr-0.5" />}
                {causalInfo.bn}
              </Badge>
              <Badge className={`severity-${disease.severity} text-[9px] px-1.5 py-0 border-0`}>
                {severityLabels[disease.severity]}
              </Badge>
              {!disease.isBiotic && (
                <Badge className="text-[9px] bg-krishi-sky/10 text-krishi-sky border-0 px-1.5 py-0">
                  অজৈব/পরিবেশজনিত
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-foreground">{disease.confidence}%</div>
            <div className="text-[9px] text-muted-foreground">নির্ভুলতা</div>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-2">
          <Progress value={disease.confidence} className="h-1.5" />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <Separator />

            {/* Description */}
            <div className="space-y-2 pt-3">
              <h5 className="text-xs font-semibold text-foreground flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-krishi-amber" /> বিবরণ
              </h5>
              <p className="text-xs text-muted-foreground leading-relaxed">{disease.description}</p>
            </div>

            {/* Symptoms */}
            {disease.symptoms.length > 0 && (
              <div className="space-y-1.5 pt-3">
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-krishi-green" /> লক্ষণসমূহ
                </h5>
                <ul className="space-y-0.5">
                  {disease.symptoms.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                      <span className="text-krishi-green mt-0.5 shrink-0">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Biotic / Abiotic indicator */}
            <div className="pt-3">
              <div className={`flex items-center gap-1.5 p-2 rounded-lg text-xs ${
                disease.isBiotic
                  ? 'bg-krishi-amber/5 text-krishi-amber'
                  : 'bg-krishi-sky/5 text-krishi-sky'
              }`}>
                {disease.isBiotic ? (
                  <><Bug className="w-3.5 h-3.5" /> জৈব কারণ (ছত্রাক/ব্যাকটেরিয়া/ভাইরাস/পোকা) — সংক্রামক</>
                ) : (
                  <><Thermometer className="w-3.5 h-3.5" /> অজৈব কারণ (পরিবেশ/পুষ্টি) — সংক্রামক নয়</>
                )}
              </div>
            </div>

            {/* CABI Green/Yellow Treatment Lists */}
            <div className="space-y-2 pt-3">
              <h5 className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-krishi-green" /> চিকিৎসা (CABI Plantwise পদ্ধতি)
              </h5>

              {/* Tab Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button
                  onClick={() => onTabChange('green')}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-all ${
                    activeTab === 'green'
                      ? 'bg-krishi-green text-white'
                      : 'bg-white text-muted-foreground hover:bg-krishi-green/5'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  সবুজ তালিকা (জৈব)
                </button>
                <button
                  onClick={() => onTabChange('yellow')}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-all ${
                    activeTab === 'yellow'
                      ? 'bg-krishi-amber text-white'
                      : 'bg-white text-muted-foreground hover:bg-krishi-amber/5'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  হলুদ তালিকা (রাসায়নিক)
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'green' ? (
                  <motion.div
                    key="green"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-krishi-green/5 rounded-lg p-3 space-y-1"
                  >
                    <p className="text-[10px] text-krishi-green font-medium mb-1">
                      🌿 CABI সবুজ তালিকা — জৈব/প্রতিরোধমূলক (কীটনাশক মুক্ত)
                    </p>
                    {disease.greenList.length > 0 ? disease.greenList.map((item, i) => (
                      <div key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                        <span className="text-krishi-green shrink-0">✓</span>
                        <span>{item}</span>
                      </div>
                    )) : (
                      <p className="text-xs text-muted-foreground">কোনো জৈব নিয়ন্ত্রণ পদ্ধতি উপলব্ধ নেই</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="yellow"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="bg-krishi-amber/5 rounded-lg p-3 space-y-1"
                  >
                    <p className="text-[10px] text-krishi-amber font-medium mb-1">
                      ⚠️ CABI হলুদ তালিকা — রাসায়নিক নিয়ন্ত্রণ (সতর্কতার সাথে ব্যবহার)
                    </p>
                    {disease.yellowList.length > 0 ? disease.yellowList.map((item, i) => (
                      <div key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                        <span className="text-krishi-amber shrink-0">⚡</span>
                        <span>{item}</span>
                      </div>
                    )) : (
                      <p className="text-xs text-muted-foreground">কোনো রাসায়নিক পদ্ধতি উপলব্ধ নেই</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Prevention Checklist */}
            {disease.prevention.length > 0 && (
              <div className="space-y-1.5 pt-3">
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-krishi-green" /> প্রতিরোধের উপায়
                </h5>
                <div className="space-y-0.5">
                  {disease.prevention.map((item, i) => (
                    <div key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                      <span className="text-krishi-green shrink-0">☐</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spread & Conditions */}
            <div className="grid grid-cols-2 gap-2 pt-3">
              {disease.spreadMethod && (
                <div className="bg-muted/50 rounded-lg p-2 space-y-0.5">
                  <p className="text-[9px] font-medium text-muted-foreground">ছড়ানোর পদ্ধতি</p>
                  <p className="text-[10px] text-foreground">{disease.spreadMethod}</p>
                </div>
              )}
              {disease.favorableConditions && (
                <div className="bg-muted/50 rounded-lg p-2 space-y-0.5">
                  <p className="text-[9px] font-medium text-muted-foreground">অনুকূল পরিবেশ</p>
                  <p className="text-[10px] text-foreground">{disease.favorableConditions}</p>
                </div>
              )}
            </div>

            {/* Districts & Seasonality */}
            {(disease.districts.length > 0 || disease.seasonality) && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {disease.seasonality && (
                  <Badge className="bg-krishi-earth/10 text-krishi-earth border-0 text-[9px]">
                    <Clock className="w-2.5 h-2.5 mr-0.5" /> {disease.seasonality}
                  </Badge>
                )}
                {disease.districts.slice(0, 4).map(d => (
                  <Badge key={d} className="bg-krishi-sky/10 text-krishi-sky border-0 text-[9px]">
                    <MapPin className="w-2.5 h-2.5 mr-0.5" /> {d}
                  </Badge>
                ))}
                {disease.districts.length > 4 && (
                  <Badge className="bg-muted text-muted-foreground border-0 text-[9px]">
                    +{disease.districts.length - 4} জেলা
                  </Badge>
                )}
              </div>
            )}

            {/* Similar Diseases (CABI Confusion Table) */}
            {disease.similarDiseases.length > 0 && (
              <div className="space-y-1.5 pt-3">
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-krishi-sky" /> একই রকম রোগ (বিভ্রান্তির সম্ভাবনা)
                </h5>
                <div className="space-y-1">
                  {disease.similarDiseases.map(sim => (
                    <div key={sim.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-muted/30">
                      <span className="text-xs">{severityIcons[CAUSAL_TYPE_LABELS[sim.causalType] ? 'medium' as SeverityLevel : 'medium' as SeverityLevel]}</span>
                      <div>
                        <span className="text-xs font-medium text-foreground">{sim.nameBn}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">({sim.nameEn})</span>
                      </div>
                      <Badge
                        className="text-[8px] border-0 px-1 py-0 ml-auto"
                        style={{
                          color: CAUSAL_TYPE_LABELS[sim.causalType]?.color,
                          background: `${CAUSAL_TYPE_LABELS[sim.causalType]?.color}15`,
                        }}
                      >
                        {CAUSAL_TYPE_LABELS[sim.causalType]?.bn}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

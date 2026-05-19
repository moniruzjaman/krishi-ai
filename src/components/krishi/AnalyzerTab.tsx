'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Scan, Leaf, AlertTriangle, CheckCircle, Clock, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useKrishiStore, type ScanResult } from '@/lib/krishi-store'
import { toast } from '@/hooks/use-toast'

interface AnalysisResult {
  disease: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  diagnosis: string
  treatment: string
  source: string
}

const severityLabels: Record<string, string> = {
  low: 'হালকা',
  medium: 'মাঝারি',
  high: 'মারাত্মক',
  critical: 'সংকটাপন্ন',
}

export default function AnalyzerTab() {
  const { scanHistory, addScanResult, isAnalyzing, setIsAnalyzing, clearScanHistory } = useKrishiStore()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMime, setImageMime] = useState<string>('image/jpeg')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setResult(null)
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
    setResult(null)
  }, [imagePreview])

  const handleAnalyze = useCallback(async () => {
    if (!imageBase64) return
    setIsAnalyzing(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, mimeType: imageMime }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data: AnalysisResult = await res.json()
      setResult(data)
      const scan: ScanResult = {
        id: Date.now().toString(),
        imageUrl: imagePreview || '',
        disease: data.disease,
        severity: data.severity,
        confidence: data.confidence,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        timestamp: Date.now(),
      }
      addScanResult(scan)
    } catch {
      toast({ title: 'ত্রুটি', description: 'বিশ্লেষণে সমস্যা হয়েছে, আবার চেষ্টা করুন' })
    } finally {
      setIsAnalyzing(false)
    }
  }, [imageBase64, imageMime, imagePreview, setIsAnalyzing, addScanResult])

  const handleReset = useCallback(() => {
    clearImage()
  }, [clearImage])

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="page-content p-4 space-y-4 custom-scroll">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-krishi-green/10 flex items-center justify-center">
          <Scan className="w-5 h-5 text-krishi-green" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">ফসল বিশ্লেষক</h2>
          <p className="text-xs text-muted-foreground">ছবি আপলোড করে রোগ নির্ণয় করুন</p>
        </div>
      </div>

      {/* Upload Area */}
      {!result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="mat-card elevation-1 border-2 border-dashed border-krishi-green/30 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-krishi-green/50 hover:bg-krishi-green/[0.02] transition-all min-h-[200px]"
            >
              <div className="w-14 h-14 rounded-full bg-krishi-green/10 flex items-center justify-center">
                <Camera className="w-7 h-7 text-krishi-green" />
              </div>
              <p className="text-sm font-medium text-foreground">ছবি তুলুন বা আপলোড করুন</p>
              <p className="text-xs text-muted-foreground">JPG, PNG - সর্বোচ্চ ৫MB</p>
              <div className="flex items-center gap-2 mt-1">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">ড্র্যাগ & ড্রপ বা ক্লিক করুন</span>
              </div>
            </div>
          ) : (
            <div className="mat-card elevation-1 space-y-3">
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="আপলোড করা ছবি" className="w-full h-52 object-cover rounded-xl" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                    <div className="shimmer w-full h-full absolute inset-0 rounded-xl" />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-10 h-10 border-3 border-krishi-green border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-medium text-krishi-green">বিশ্লেষণ হচ্ছে...</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={clearImage}
                  disabled={isAnalyzing}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full h-11 bg-gradient-to-r from-krishi-green-dark to-krishi-green text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
              >
                <Scan className="w-4 h-4" />
                বিশ্লেষণ শুরু করুন
              </Button>
            </div>
          )}
        </motion.div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Analysis Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mat-card elevation-2 space-y-4"
          >
            {/* Disease Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-5 h-5 text-krishi-amber shrink-0" />
                  <h3 className="text-lg font-bold text-foreground">{result.disease}</h3>
                </div>
                <Badge className={`severity-${result.severity} text-xs font-semibold border-0`}>
                  {severityLabels[result.severity]}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {result.source === 'gemini' ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-krishi-green" /> Gemini AI</>
                ) : (
                  <><CheckCircle className="w-3.5 h-3.5 text-krishi-amber" /> রুল-ভিত্তিক</>
                )}
              </div>
            </div>

            {/* Confidence */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">নির্ভুলতা</span>
                <span className="font-semibold text-foreground">{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} className="h-2" />
            </div>

            <Separator />

            {/* Diagnosis */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-krishi-green" />
                রোগ নির্ণয়
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.diagnosis}</p>
            </div>

            <Separator />

            {/* Treatment */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-foreground">চিকিৎসা</h4>
              <ul className="space-y-1">
                {result.treatment.split('\n').filter(Boolean).map((line, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-1.5">
                    <span className="text-krishi-green mt-0.5 shrink-0">•</span>
                    <span>{line.replace(/^[•\s]+/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full h-10 rounded-xl border-krishi-green/30 text-krishi-green hover:bg-krishi-green/5"
            >
              নতুন বিশ্লেষণ
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan History */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
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
          <div className="mat-card elevation-1 py-8 flex flex-col items-center gap-2 text-center">
            <Leaf className="w-8 h-8 text-krishi-green/30" />
            <p className="text-sm text-muted-foreground">এখনো কোনো বিশ্লেষণ নেই</p>
            <p className="text-xs text-muted-foreground/60">ছবি আপলোড করে শুরু করুন</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto custom-scroll space-y-2">
            {scanHistory.map((scan) => (
              <div key={scan.id} className="mat-card elevation-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-krishi-green/10 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-krishi-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{scan.disease}</p>
                    <Badge className={`severity-${scan.severity} text-[10px] px-1.5 py-0 border-0`}>
                      {severityLabels[scan.severity]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">নির্ভুলতা: {scan.confidence}% • {formatTime(scan.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

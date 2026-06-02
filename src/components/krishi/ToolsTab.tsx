'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench, Heart, Layers, BookOpen, Shield, ChevronRight, ArrowLeft,
  AlertTriangle, CheckCircle, Leaf, Droplets, FlaskConical, Bug
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useKrishiStore } from '@/lib/krishi-store'

const TOOLS = [
  { id: 'plant-health' as const, title: 'উদ্ভিদ স্বাস্থ্য', subtitle: 'গাছের স্বাস্থ্য পরীক্ষা করুন', icon: Heart, accent: 'bg-krishi-green/10 text-krishi-green', border: 'border-krishi-green/20' },
  { id: 'soil-audit' as const, title: 'মাটি অডিট', subtitle: 'মাটির গুণমান যাচাই করুন', icon: Layers, accent: 'bg-krishi-earth/10 text-krishi-earth', border: 'border-krishi-earth/20' },
  { id: 'crop-library' as const, title: 'ফসল পথিকা', subtitle: 'ফসলের তথ্য ও পরামর্শ', icon: BookOpen, accent: 'bg-krishi-amber/10 text-krishi-amber', border: 'border-krishi-amber/20' },
  { id: 'pesticide' as const, title: 'কীটনাশক গাইড', subtitle: 'নিরাপদ কীটনাশক ব্যবহার', icon: Shield, accent: 'bg-krishi-red/10 text-krishi-red', border: 'border-krishi-red/20' },
]

const CROPS = ['ধান', 'গম', 'পাট', 'আলু', 'সরিষা', 'পেঁয়াজ']
const SYMPTOMS = ['পাতা হলদেটে', 'পাতায় দাগ', 'গাছ শুকিয়ে যাওয়া', 'ফল পচা', 'অন্যান্য']

const DISEASES = [
  { name: 'ব্লাস্ট রোগ', crop: 'ধান', severity: 'high' as const },
  { name: 'পারদার পোকা', crop: 'ধান', severity: 'critical' as const },
  { name: 'পাতার দাগ রোগ', crop: 'গম', severity: 'medium' as const },
]

const SOIL_DATA = [
  { label: 'pH মাত্রা', value: 68, display: '৬.৮', color: 'bg-krishi-green' },
  { label: 'জৈব পদার্থ', value: 45, display: '৪.৫%', color: 'bg-krishi-amber' },
  { label: 'নাইট্রোজেন', value: 55, display: 'মাঝারি', color: 'bg-krishi-sky' },
  { label: 'ফসফরাস', value: 38, display: 'কম', color: 'bg-krishi-red' },
  { label: 'পটাসিয়াম', value: 62, display: 'ভালো', color: 'bg-krishi-green-light' },
]

const CROP_CARDS = [
  { emoji: '🌾', name: 'ধান', season: 'বোরো/আউশ/আমন', info: 'বাংলাদেশের প্রধান খাদ্য ফসল। বারি-২৮, ব্রি-২৯ জাত জনপ্রিয়।' },
  { emoji: '🌿', name: 'গম', season: 'শীতকাল', info: 'নভেম্বর-ডিসেম্বরে বীজ বপন। বারি গম-২৫, ২৬ উচ্চফলনশীল।' },
  { emoji: '🪢', name: 'পাট', season: 'বর্ষাকাল', info: 'সোনালি আঁশের উৎস। বর্ষার শুরুতে চাষ উপযোগী।' },
  { emoji: '🥔', name: 'আলু', season: 'শীতকাল', info: 'কার্তিক-অগ্রহায়ণে বপন। বারি আলু-৭২ জনপ্রিয় জাত।' },
  { emoji: '🌻', name: 'সরিষা', season: 'শীতকাল', info: 'তেল ফসল হিসেবে চাষ। বারি সরিষা-১৪ উন্নত জাত।' },
  { emoji: '🧅', name: 'পেঁয়াজ', season: 'শীতকাল', info: 'কার্তিক-অগ্রহায়ণে চাষ। বারি পেঁয়াজ-৫ ভালো ফলন দেয়।' },
]

const PESTICIDES = [
  { name: 'ছত্রাকনাশক', icon: Leaf, desc: 'ছত্রাকজনিত রোগ দমনে ব্যবহৃত। পাতায় দাগ, গাছ পচা ইত্যাদি রোগে কার্যকর।', safety: 'সন্ধ্যায় প্রয়োগ করুন। ফসল তোলার ১৫ দিন আগে বন্ধ করুন।' },
  { name: 'ব্যাকটেরিয়ানাশক', icon: FlaskConical, desc: 'ব্যাকটেরিয়াজনিত রোগ প্রতিরোধে ব্যবহৃত। গাছ শুকিয়ে যাওয়া রোগে কার্যকর।', safety: 'প্রতিরোধমূলক হিসেবে ব্যবহার করুন। পরিমাণ মেনে চলুন।' },
  { name: 'কীটনাশক', icon: Bug, desc: 'পোকামাকড় দমনে ব্যবহৃত। মাজরা পোকা, ফল ছিদ্রকারী পোকা ইত্যাদি দমনে।', safety: 'মুখে মাস্ক পরুন। ফসল তোলার ২১ দিন আগে বন্ধ করুন।' },
  { name: 'আগাছানাশক', icon: Droplets, desc: 'আগাছা নিয়ন্ত্রণে ব্যবহৃত। ফসলের বৃদ্ধির প্রাথমিক পর্যায়ে প্রয়োগ।', safety: 'ফসলের পাতায় সরাসরি প্রয়োগ এড়িয়ে চলুন। সকালে প্রয়োগ করুন।' },
]

const severityLabel: Record<string, string> = { low: 'হালকা', medium: 'মাঝারি', high: 'মারাত্মক', critical: 'সংকটাপন্ন' }

const slideIn = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } }

export default function ToolsTab() {
  const { toolsSubPage, setToolsSubPage } = useKrishiStore()
  const [selectedCrop, setSelectedCrop] = useState('')
  const [selectedSymptom, setSelectedSymptom] = useState('')
  const [showAdvice, setShowAdvice] = useState(false)
  const [expandedCrop, setExpandedCrop] = useState<number | null>(null)

  return (
    <div className="page-content p-4 space-y-4 custom-scroll">
      <AnimatePresence mode="wait">
        {/* Main Tools Page */}
        {toolsSubPage === null && (
          <motion.div key="main" {...slideIn} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-krishi-earth/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-krishi-earth" />
              </div>
              <h2 className="text-lg font-bold text-foreground">কৃষি সরঞ্জাম</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TOOLS.map((tool, i) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  onClick={() => setToolsSubPage(tool.id)}
                  className={`mat-card elevation-1 ripple cursor-pointer border ${tool.border} space-y-3`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.accent}`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tool.subtitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Plant Health Sub-page */}
        {toolsSubPage === 'plant-health' && (
          <motion.div key="plant-health" {...slideIn} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => { setToolsSubPage(null); setShowAdvice(false) }} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center ripple">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="text-lg font-bold text-foreground">উদ্ভিদ স্বাস্থ্য</h2>
            </div>
            <div className="mat-card elevation-1 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">দ্রুত রোগ নির্ণয়</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">ফসল নির্বাচন</label>
                <div className="flex flex-wrap gap-1.5">
                  {CROPS.map((c) => (
                    <button key={c} onClick={() => { setSelectedCrop(c); setShowAdvice(false) }}
                      className={`mat-chip ripple ${selectedCrop === c ? 'bg-krishi-green text-white' : 'bg-gray-100 text-foreground'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">লক্ষণ নির্বাচন</label>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOMS.map((s) => (
                    <button key={s} onClick={() => { setSelectedSymptom(s); setShowAdvice(false) }}
                      className={`mat-chip ripple ${selectedSymptom === s ? 'bg-krishi-green text-white' : 'bg-gray-100 text-foreground'}`}>{s}</button>
                  ))}
                </div>
              </div>
              <Button onClick={() => setShowAdvice(true)} disabled={!selectedCrop || !selectedSymptom}
                className="w-full h-10 bg-krishi-green text-white rounded-xl font-semibold disabled:opacity-50">
                <Heart className="w-4 h-4" /> পরামর্শ নিন
              </Button>
            </div>
            {showAdvice && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mat-card elevation-1 space-y-2 border border-krishi-green/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-krishi-green" />
                  <h4 className="text-sm font-semibold text-foreground">পরামর্শ</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedCrop}-এ {selectedSymptom} লক্ষণ দেখা দিলে সম্ভবত ছত্রাকজনিত সংক্রমণ।
                  তাম্র যুক্ত ছত্রাকনাশক প্রয়োগ করুন এবং আক্রান্ত পাতা সরিয়ে ফেলুন। পানি সেচের পরিমাণ কমান।
                </p>
              </motion.div>
            )}
            <div className="mat-card elevation-1 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">সাধারণ রোগ</h3>
              {DISEASES.map((d) => (
                <div key={d.name} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm text-foreground font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.crop}</p>
                  </div>
                  <Badge className={`severity-${d.severity} text-[10px] px-1.5 py-0 border-0`}>{severityLabel[d.severity]}</Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Soil Audit Sub-page */}
        {toolsSubPage === 'soil-audit' && (
          <motion.div key="soil-audit" {...slideIn} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setToolsSubPage(null)} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center ripple">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="text-lg font-bold text-foreground">মাটি অডিট</h2>
            </div>
            <div className="mat-card elevation-1 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">মাটির স্বাস্থ্য সূচক</h3>
              {SOIL_DATA.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.display}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }} className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mat-card elevation-1 space-y-2 border border-krishi-earth/20">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-krishi-earth" /> মাটি পরীক্ষার পরামর্শ
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed">
                <li className="flex gap-1.5"><span className="text-krishi-earth">•</span>প্রতি ২ বছর অন্তর মাটি পরীক্ষা করুন</li>
                <li className="flex gap-1.5"><span className="text-krishi-earth">•</span>জৈব সার ব্যবহার বাড়ান মাটির উর্বরতা বাড়াতে</li>
                <li className="flex gap-1.5"><span className="text-krishi-earth">•</span>ডিএপি ও এমওপি সার সঠিক অনুপাতে প্রয়োগ করুন</li>
                <li className="flex gap-1.5"><span className="text-krishi-earth">•</span>ফসফরাস কম থাকলে টিএসপি সার ব্যবহার করুন</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Crop Library Sub-page */}
        {toolsSubPage === 'crop-library' && (
          <motion.div key="crop-library" {...slideIn} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => { setToolsSubPage(null); setExpandedCrop(null) }} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center ripple">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="text-lg font-bold text-foreground">ফসল পথিকা</h2>
            </div>
            <div className="space-y-2">
              {CROP_CARDS.map((crop, i) => (
                <motion.div key={crop.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }} onClick={() => setExpandedCrop(expandedCrop === i ? null : i)}
                  className="mat-card elevation-1 ripple cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{crop.emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{crop.name}</h3>
                      <p className="text-xs text-muted-foreground">{crop.season}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedCrop === i ? 'rotate-90' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {expandedCrop === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="pt-2 mt-2 border-t border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed">{crop.info}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pesticide Guide Sub-page */}
        {toolsSubPage === 'pesticide' && (
          <motion.div key="pesticide" {...slideIn} transition={{ duration: 0.25 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setToolsSubPage(null)} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center ripple">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="text-lg font-bold text-foreground">কীটনাশক গাইড</h2>
            </div>
            <div className="mat-card elevation-1 border border-krishi-red/20 bg-krishi-red/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-krishi-red" />
                <h3 className="text-sm font-semibold text-krishi-red">সতর্কতা</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                কীটনাশক ব্যবহারে সর্বোচ্চ সতর্কতা অবলম্বন করুন। সুপারিশকৃত মাত্রায় প্রয়োগ করুন এবং সুরক্ষা সরঞ্জাম পরুন।
              </p>
            </div>
            <div className="space-y-2">
              {PESTICIDES.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }} className="mat-card elevation-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-krishi-red/10 flex items-center justify-center">
                      <p.icon className="w-4 h-4 text-krishi-red" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  <div className="bg-krishi-amber/5 rounded-lg p-2">
                    <p className="text-xs text-krishi-amber font-medium">নিরাপদ ব্যবহার:</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.safety}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

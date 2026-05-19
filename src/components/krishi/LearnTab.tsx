'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap, Play, Clock, Eye, FileText, Download,
  CheckCircle, XCircle, ChevronRight, Brain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const FEATURED = { title: 'ধান চাষের আধুনিক পদ্ধতি', duration: '১৫:৩০', views: '১২.৫K' }

const VIDEOS = [
  { title: 'সার প্রয়োগের সঠিক নিয়ম', duration: '১০:১৫', color: 'bg-krishi-green' },
  { title: 'পোকামাকড় দমন পদ্ধতি', duration: '০৮:৪৫', color: 'bg-krishi-red' },
  { title: 'জৈব চাষের উপায়', duration: '১২:০০', color: 'bg-krishi-amber' },
  { title: 'ফসল সংরক্ষণ', duration: '০৭:৩০', color: 'bg-krishi-sky' },
]

const QUIZ_QUESTIONS = [
  { question: 'এই লক্ষণটি কোন রোগের? — ধানের পাতায় হীরেআকৃতির দাগ', options: ['ব্লাস্ট রোগ', 'টুংরো', 'পারদার পোকা', 'ব্যাকটেরিয়াল ব্লাইট'], correct: 0 },
  { question: 'মাটির pH মাত্রা ৫.৫ হলে কী করবেন?', options: ['চুন প্রয়োগ', 'সালফার যোগ', 'কিছু করতে হবে না', 'পানি বাড়াবেন'], correct: 0 },
  { question: 'বোরো ধানের চাষের সময় কোনটি?', options: ['নভেম্বর-ডিসেম্বর', 'মার্চ-এপ্রিল', 'জুলাই-আগস্ট', 'সেপ্টেম্বর-অক্টোবর'], correct: 0 },
]

const PUBLICATIONS = [
  { title: 'বারি ধান উৎপাদন গাইড', size: 'PDF 2.3 MB' },
  { title: 'ডিএই কৃষি সেবা হ্যান্ডবুক', size: 'PDF 4.1 MB' },
  { title: 'ব্রি উন্নত জাত তালিকা', size: 'PDF 1.8 MB' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

export default function LearnTab() {
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  const currentQ = QUIZ_QUESTIONS[qIndex % QUIZ_QUESTIONS.length]

  const handleAnswer = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === currentQ.correct) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    setQIndex((i) => i + 1)
    setSelected(null)
    setAnswered(false)
  }

  return (
    <div className="page-content p-4 space-y-4 custom-scroll">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-krishi-sky/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-krishi-sky" />
        </div>
        <h2 className="text-lg font-bold text-foreground">শিক্ষা কেন্দ্র</h2>
      </div>

      {/* Featured Video */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        className="mat-card elevation-1 overflow-hidden p-0">
        <div className="relative h-44 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 60%, #0288D1 100%)' }}>
          <div className="absolute inset-0 bg-black/10" />
          <button className="relative z-10 w-14 h-14 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center ripple">
            <Play className="w-7 h-7 text-white ml-1" />
          </button>
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <h3 className="text-white font-bold text-sm">{FEATURED.title}</h3>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{FEATURED.duration}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{FEATURED.views}</span>
          </div>
          <Badge className="bg-krishi-green/10 text-krishi-green text-[10px] border-0">ফিচার্ড</Badge>
        </div>
      </motion.div>

      {/* Video Grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">শিক্ষামূলক ভিডিও</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {VIDEOS.map((v, i) => (
            <motion.div key={v.title} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
              className="mat-card elevation-1 p-0 overflow-hidden cursor-pointer ripple">
              <div className={`relative h-20 ${v.color} flex items-center justify-center`}>
                <Play className="w-6 h-6 text-white/60" />
                <Badge className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[9px] px-1.5 py-0 border-0 rounded">
                  <Clock className="w-2.5 h-2.5 mr-0.5" />{v.duration}
                </Badge>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">{v.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Diagnosis Game */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-krishi-amber" />
          <h3 className="text-sm font-semibold text-foreground">রোগ নির্ণয় খেলা</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-2">আপনার জ্ঞান পরীক্ষা করুন!</p>
        <div className="mat-card elevation-1 space-y-3 border border-krishi-amber/20">
          <div className="flex items-center justify-between">
            <Badge className="bg-krishi-amber/10 text-krishi-amber text-[10px] border-0">
              প্রশ্ন {(qIndex % QUIZ_QUESTIONS.length) + 1}/{QUIZ_QUESTIONS.length}
            </Badge>
            <span className="text-xs font-semibold text-krishi-green">স্কোর: {score}</span>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed">{currentQ.question}</p>
          <div className="space-y-1.5">
            {currentQ.options.map((opt, idx) => {
              const isCorrect = idx === currentQ.correct
              const isSelected = idx === selected
              let cls = 'mat-chip w-full justify-start bg-gray-100 text-foreground'
              if (answered && isCorrect) cls = 'mat-chip w-full justify-start bg-krishi-green/10 text-krishi-green border border-krishi-green/30'
              if (answered && isSelected && !isCorrect) cls = 'mat-chip w-full justify-start bg-krishi-red/10 text-krishi-red border border-krishi-red/30'
              return (
                <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered} className={cls}>
                  {answered && isCorrect && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                  {answered && isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                  {!answered && <span className="w-3.5 text-center shrink-0 text-xs">{String.fromCharCode(2438 + idx)}</span>}
                  <span className="text-left">{opt}</span>
                </button>
              )
            })}
          </div>
          {answered && (
            <Button onClick={nextQuestion} size="sm"
              className="w-full h-9 bg-krishi-amber text-white rounded-xl font-semibold text-xs">
              পরবর্তী প্রশ্ন <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Publications */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-krishi-earth" />
          <h3 className="text-sm font-semibold text-foreground">সরকারি প্রকাশনা</h3>
        </div>
        <div className="space-y-2">
          {PUBLICATIONS.map((pub, i) => (
            <div key={pub.title}
              className="mat-card elevation-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-krishi-red/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-krishi-red" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{pub.title}</p>
                <p className="text-xs text-muted-foreground">{pub.size}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-krishi-green">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

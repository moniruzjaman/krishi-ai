'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import {
  User, MapPin, Pencil, Save, CheckCircle, Trash2, Info, MessageSquare,
  Settings, BarChart3, ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '@/components/krishi/ThemeToggle'
import { useKrishiStore } from '@/lib/krishi-store'
import {
  getAnalyticsUrl,
  isAnalyticsEnabled,
  setAnalyticsEnabled,
  setAnalyticsUrl,
  subscribeAnalytics,
  Events as AnalyticsEvents,
} from '@/lib/analytics'

const DISTRICTS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ']
const CROP_OPTIONS = ['ধান', 'গম', 'পাট', 'আলু', 'সরিষা', 'পেঁয়াজ', 'ভুট্টা', 'ডাল']
const FARM_SIZES = ['১ একরের কম', '১-৫ একর', '৫-১০ একর', '১০+ একর']
const EXPERIENCES = ['১ বছরের কম', '১-৫ বছর', '৫-১০ বছর', '১০+ বছর']

const FEATURES = [
  'রোগ নির্ণয় ও পরামর্শ',
  'আবহাওয়া পূর্বাভাস',
  'বাজার মূল্য তথ্য',
  'কীটনাশক গাইড',
  'ফসল পথিকা',
  'এআই চ্যাট সহায়ক',
]

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

export default function ProfileTab() {
  const { farmerProfile, updateFarmerProfile } = useKrishiStore()
  const [form, setForm] = useState({ ...farmerProfile })
  const [saved, setSaved] = useState(false)

  // Analytics preference lives in localStorage, so read it through a
  // subscription rather than mirroring it into React state.
  const analyticsOn = useSyncExternalStore(
    subscribeAnalytics,
    isAnalyticsEnabled,
    () => false
  )

  const toggleCrop = (crop: string) => {
    setForm((f) => ({
      ...f,
      crops: f.crops.includes(crop) ? f.crops.filter((c) => c !== crop) : [...f.crops, crop],
    }))
  }

  const handleSave = () => {
    updateFarmerProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('krishi-chat')
      localStorage.removeItem('krishi-scans')
      localStorage.removeItem('krishi-profile')
    }
    setForm({ name: '', district: 'ঢাকা', crops: [], farmSize: '১-৫ একর', experience: '৫-১০ বছর', phone: '' })
    updateFarmerProfile({ name: '', district: 'ঢাকা', crops: [], farmSize: '১-৫ একর', experience: '৫-১০ বছর', phone: '' })
  }

  const initials = form.name ? form.name.slice(0, 2) : ''

  return (
    <div className="page-content p-4 space-y-4 custom-scroll">
      {/* Profile Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' }}>
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
            {initials ? (
              <span className="text-xl font-bold">{initials}</span>
            ) : (
              <User className="w-8 h-8 text-white/80" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{form.name || 'অতিথি'}</h2>
            {form.district && (
              <Badge className="bg-white/20 text-white text-[10px] border-0 mt-1">
                <MapPin className="w-3 h-3 mr-0.5" />{form.district}
              </Badge>
            )}
          </div>
          <button onClick={() => document.getElementById('profile-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ripple">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div id="profile-form" custom={1} variants={fadeUp} initial="hidden" animate="visible"
        className="mat-card elevation-1 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">প্রোফাইল তথ্য</h3>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">নাম</label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="আপনার নাম লিখুন" className="h-10 rounded-xl text-sm" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">জেলা</label>
          <div className="flex flex-wrap gap-1.5">
            {DISTRICTS.map((d) => (
              <button key={d} onClick={() => setForm((f) => ({ ...f, district: d }))}
                className={`mat-chip ripple ${form.district === d ? 'bg-krishi-green text-white' : 'bg-gray-100 dark:bg-muted text-foreground'}`}>{d}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">ফসল</label>
          <div className="flex flex-wrap gap-1.5">
            {CROP_OPTIONS.map((c) => (
              <button key={c} onClick={() => toggleCrop(c)}
                className={`mat-chip ripple ${form.crops.includes(c) ? 'bg-krishi-amber text-white' : 'bg-gray-100 dark:bg-muted text-foreground'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">খামারের আকার</label>
          <div className="flex flex-wrap gap-1.5">
            {FARM_SIZES.map((s) => (
              <button key={s} onClick={() => setForm((f) => ({ ...f, farmSize: s }))}
                className={`mat-chip ripple ${form.farmSize === s ? 'bg-krishi-sky text-white' : 'bg-gray-100 dark:bg-muted text-foreground'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">অভিজ্ঞতা</label>
          <div className="flex flex-wrap gap-1.5">
            {EXPERIENCES.map((e) => (
              <button key={e} onClick={() => setForm((f) => ({ ...f, experience: e }))}
                className={`mat-chip ripple ${form.experience === e ? 'bg-krishi-earth text-white' : 'bg-gray-100 dark:bg-muted text-foreground'}`}>{e}</button>
            ))}
          </div>
        </div>

        <Button onClick={handleSave}
          className={`w-full h-11 rounded-xl font-semibold transition-all ${saved ? 'bg-krishi-green-light' : 'bg-krishi-green text-white'}`}>
          {saved ? <><CheckCircle className="w-4 h-4" /> সংরক্ষিত!</> : <><Save className="w-4 h-4" /> সংরক্ষণ করুন</>}
        </Button>
      </motion.div>

      {/* App Info */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
        className="mat-card elevation-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-krishi-green/10 flex items-center justify-center">
            <Info className="w-4 h-4 text-krishi-green" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">কৃষি এআই v2.0</h3>
            <p className="text-[10px] text-muted-foreground">স্মার্ট কৃষি সহায়ক</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-krishi-green shrink-0" />{f}
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm"
          className="w-full h-9 rounded-xl border-krishi-green/30 text-krishi-green text-xs">
          <MessageSquare className="w-3.5 h-3.5" /> মতামত দিন
        </Button>
      </motion.div>

      {/* Settings */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
        className="mat-card elevation-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-krishi-sky/10 flex items-center justify-center">
            <Settings className="w-4 h-4 text-krishi-sky" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">সেটিংস</h3>
            <p className="text-[10px] text-muted-foreground">অ্যাপের পছন্দ</p>
          </div>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between py-1">
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground">থিম</p>
            <p className="text-[10px] text-muted-foreground">
              উজ্জ্বল বা অন্ধকার থিম বেছে নিন
            </p>
          </div>
          <ThemeToggle className="bg-muted text-foreground" />
        </div>

        {/* Analytics */}
        <div className="flex items-center justify-between py-1">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              ব্যবহার পরিসংখ্যান
            </p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              কোনো ব্যক্তিগত তথ্য ছাড়া, কুকি ছাড়া। সম্পূর্ণ ঐচ্ছিক।
            </p>
          </div>
          <button
            onClick={() => {
              if (analyticsOn) {
                setAnalyticsEnabled(false)
                AnalyticsEvents.ANALYTICS_TOGGLE(false)
                return
              }
              const url = window.prompt(
                'পরিসংখ্যান সার্ভারের URL দিন (Plausible / Umami):\nখালি রাখলে https://plausible.io ব্যবহার হবে।',
                getAnalyticsUrl() || 'https://plausible.io'
              )
              if (url === null) return
              setAnalyticsUrl(url.trim() || 'https://plausible.io')
              setAnalyticsEnabled(true)
              AnalyticsEvents.ANALYTICS_TOGGLE(true)
            }}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
              analyticsOn ? 'bg-krishi-green' : 'bg-muted'
            }`}
            aria-label="ব্যবহার পরিসংখ্যান"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                analyticsOn ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Privacy */}
        <a
          href="/privacy.html"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 pt-2 border-t border-border/30 text-xs text-muted-foreground hover:text-krishi-green transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          গোপনীয়তা নীতি পড়ুন
        </a>
      </motion.div>

      {/* Quick Actions */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
        className="mat-card elevation-1 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">দ্রুত কার্যক্রম</h3>
        <Button variant="outline" size="sm" onClick={handleClearData}
          className="w-full h-9 rounded-xl border-krishi-red/30 text-krishi-red text-xs hover:bg-krishi-red/5">
          <Trash2 className="w-3.5 h-3.5" /> ডেটা মুছুন
        </Button>
        <div className="pt-2 border-t border-border/30">
          <h4 className="text-xs font-medium text-foreground mb-1">সম্পর্কে</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            কৃষি এআই বাংলাদেশের কৃষকদের জন্য একটি স্মার্ট কৃষি সহায়ক। এআই প্রযুক্তি ব্যবহার করে ফসলের রোগ নির্ণয়, আবহাওয়া পূর্বাভাস ও কৃষি পরামর্শ প্রদান করে।
          </p>
        </div>
      </motion.div>
    </div>
  )
}

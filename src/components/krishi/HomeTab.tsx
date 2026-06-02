'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Leaf, Search, Camera, Users, Wheat, MapPin, Stethoscope,
  Cloud, TrendingUp, TrendingDown, Droplets, Wind,
  ChevronRight, Newspaper, Quote
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useKrishiStore } from '@/lib/krishi-store'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' }
  })
}

const stats = [
  { label: 'কৃষক', value: '1.2 কোটি', icon: Users, color: 'bg-krishi-green/10 text-krishi-green' },
  { label: 'ফসল', value: '120+', icon: Wheat, color: 'bg-krishi-amber/10 text-krishi-amber' },
  { label: 'জেলা', value: '64', icon: MapPin, color: 'bg-krishi-sky/10 text-krishi-sky' },
  { label: 'রোগ নির্ণয়', value: '500+', icon: Stethoscope, color: 'bg-krishi-red/10 text-krishi-red' },
]

const dashProgress = [
  { label: 'ধান উৎপাদন', value: 78, color: 'bg-krishi-green' },
  { label: 'গম সংগ্রহ', value: 45, color: 'bg-krishi-amber' },
  { label: 'সার বিতরণ', value: 62, color: 'bg-krishi-sky' },
]

const marketPrices = [
  { crop: 'ধান', price: '৳1,250', unit: 'মণ', change: +2.3 },
  { crop: 'গম', price: '৳2,100', unit: 'মণ', change: -0.8 },
  { crop: 'পাট', price: '৳3,400', unit: 'মণ', change: +5.1 },
  { crop: 'আলু', price: '৳850', unit: 'মণ', change: -3.2 },
  { crop: 'সরিষা', price: '৳4,200', unit: 'মণ', change: +1.7 },
]

const newsItems = [
  { title: 'নতুন জাতের উচ্চফলনশীল ধান উদ্ভাবন', date: '১২ মার্চ ২০২৫' },
  { title: 'সরকার কৃষি ভর্তুকি বৃদ্ধির ঘোষণা', date: '১০ মার্চ ২০২৫' },
  { title: 'টেকসই কৃষি পদ্ধতিতে প্রশিক্ষণ শুরু', date: '৮ মার্চ ২০২৫' },
]

const testimonials = [
  { name: 'রহিম উদ্দিন', district: 'রাজশাহী', quote: 'কৃষি এআই আমার ধানের রোগ শনাক্ত করে সময়মতো পরামর্শ দিয়েছে। ফসল বাঁচিয়েছি!', initials: 'রউ' },
  { name: 'ফাতেমা বেগম', district: 'যশোর', quote: 'বাজার মূল্য জানতে পেলে ঠিকমতো বিক্রি করতে পারি। অনেক উপকার পাচ্ছি।', initials: 'ফব' },
  { name: 'করিম মিয়া', district: 'রংপুর', quote: 'আবহাওয়ার পূর্বাভাস দেখে বীজ বুনি। এখন আর ফসল নষ্ট হয় না।', initials: 'কম' },
]

const forecast = [
  { day: 'বুধ', icon: '⛅', temp: '33°' },
  { day: 'বৃহঃ', icon: '🌤️', temp: '34°' },
  { day: 'শুক্র', icon: '🌧️', temp: '29°' },
]

function getBengaliDate(): string {
  const now = new Date()
  const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি']
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  const h = now.getHours()
  const period = h < 12 ? 'সকাল' : h < 17 ? 'বিকাল' : 'সন্ধ্যা'
  const bengaliNum = (n: number) => n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)])
  return `${days[now.getDay()]}, ${bengaliNum(now.getDate())} ${months[now.getMonth()]} ${bengaliNum(now.getFullYear())} • ${period}`
}

export default function HomeTab() {
  const { setActiveTab } = useKrishiStore()
  const currentTime = useMemo(() => getBengaliDate(), [])

  return (
    <div className="page-content p-4 space-y-4 custom-scroll">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-6 -translate-x-6" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-6 h-6" />
            <h1 className="text-2xl font-bold">কৃষি এআই</h1>
          </div>
          <p className="text-white/80 text-sm mb-4">আপনার স্মার্ট কৃষি সহায়ক</p>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="ফসল বা রোগ খুঁজুন..."
              className="w-full bg-white/15 backdrop-blur-sm rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-colors"
            />
          </div>

          <button
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-white/25 transition-colors active:scale-95"
          >
            <Camera className="w-4 h-4" />
            ফসল স্ক্যান করুন
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mat-card elevation-1 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Dashboard */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mat-card elevation-1"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">লাইভ ড্যাশবোর্ড</h2>
          <span className="text-xs text-muted-foreground">{currentTime}</span>
        </div>
        <div className="space-y-3">
          {dashProgress.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mat-card elevation-1"
      >
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="w-4 h-4 text-krishi-sky" />
          <h2 className="font-semibold text-foreground">আজকের আবহাওয়া</h2>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">ঢাকা</p>
            <p className="text-3xl font-bold text-foreground">32°C</p>
            <p className="text-sm text-muted-foreground">আংশিক মেঘলা</p>
          </div>
          <div className="text-5xl">⛅</div>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-krishi-sky" />
            <span>৭৮%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-muted-foreground" />
            <span>১২ km/h</span>
          </div>
        </div>

        <div className="flex justify-between border-t border-border/50 pt-3">
          {forecast.map((d) => (
            <div key={d.day} className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{d.day}</p>
              <p className="text-lg">{d.icon}</p>
              <p className="text-xs font-medium text-foreground">{d.temp}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Prices */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mat-card elevation-1"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-krishi-green" />
          <h2 className="font-semibold text-foreground">বাজার মূল্য</h2>
        </div>

        <div className="space-y-2">
          {marketPrices.map((item) => (
            <div
              key={item.crop}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <span className="text-sm text-foreground font-medium">{item.crop}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">{item.price}/{item.unit}</span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${item.change > 0 ? 'text-krishi-green' : 'text-krishi-red'}`}>
                  {item.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* News Section */}
      <motion.div
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-krishi-amber" />
          <h2 className="font-semibold text-foreground">কৃষি সংবাদ</h2>
        </div>
        <div className="space-y-2">
          {newsItems.map((news, i) => (
            <motion.div
              key={i}
              custom={8 + i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mat-card elevation-1 ripple flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{news.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{news.date}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.div
        custom={11}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-2 mb-3">
          <Quote className="w-4 h-4 text-krishi-earth" />
          <h2 className="font-semibold text-foreground">কৃষকদের কথা</h2>
        </div>
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              custom={12 + i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mat-card elevation-1"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-krishi-green/10 text-krishi-green text-sm font-medium">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mb-1.5">{t.district}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, MessageCircle, ScanLine, Wrench, BookOpen, User,
  Leaf, Wifi, Battery, Signal, Bell
} from 'lucide-react'
import { useKrishiStore, type TabId } from '@/lib/krishi-store'
import HomeTab from '@/components/krishi/HomeTab'
import ChatTab from '@/components/krishi/ChatTab'
import AnalyzerTab from '@/components/krishi/AnalyzerTab'
import ToolsTab from '@/components/krishi/ToolsTab'
import LearnTab from '@/components/krishi/LearnTab'
import ProfileTab from '@/components/krishi/ProfileTab'

const navItems: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'হোম', icon: Home },
  { id: 'chat', label: 'চ্যাট', icon: MessageCircle },
  { id: 'analyzer', label: 'বিশ্লেষক', icon: ScanLine },
  { id: 'tools', label: 'সরঞ্জাম', icon: Wrench },
  { id: 'learn', label: 'শিক্ষা', icon: BookOpen },
]

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2,
}

function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="status-bar">
      <span className="font-medium">{time}</span>
      <div className="flex items-center gap-2">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4" />
      </div>
    </div>
  )
}

function AppBar() {
  const { activeTab } = useKrishiStore()
  const titles: Record<TabId, string> = {
    home: 'কৃষি এআই',
    chat: 'এআই চ্যাট',
    analyzer: 'ফসল বিশ্লেষক',
    tools: 'কৃষি সরঞ্জাম',
    learn: 'শিক্ষা কেন্দ্র',
    profile: 'প্রোফাইল',
  }

  return (
    <div className="app-bar">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">{titles[activeTab]}</h1>
          <p className="text-[10px] text-white/70 leading-tight">স্মার্ট কৃষি সহায়ক</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
          <Bell className="w-4.5 h-4.5 text-white" />
        </button>
        <button
          onClick={() => useKrishiStore.getState().setActiveTab('profile')}
          className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors"
        >
          <User className="w-4.5 h-4.5 text-white" />
        </button>
      </div>
    </div>
  )
}

function BottomNav() {
  const { activeTab, setActiveTab } = useKrishiStore()

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {isActive && <span className="nav-indicator" />}
            <Icon className={`w-5 h-5 transition-all ${isActive ? 'text-[#2E7D32] scale-110' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className={`text-[10px] transition-colors ${isActive ? 'text-[#2E7D32] font-bold' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'home': return <HomeTab />
    case 'chat': return <ChatTab />
    case 'analyzer': return <AnalyzerTab />
    case 'tools': return <ToolsTab />
    case 'learn': return <LearnTab />
    case 'profile': return <ProfileTab />
    default: return <HomeTab />
  }
}

// Splash screen
function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1800)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Leaf className="w-14 h-14 text-white" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">কৃষি এআই</h1>
          <p className="text-white/70 text-sm mt-1">স্মার্ট কৃষি সহায়ক</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 0.8, duration: 0.8, ease: 'easeInOut' }}
        className="h-1 bg-white/30 rounded-full mt-8 overflow-hidden"
      >
        <div className="h-full w-full bg-white/80 rounded-full" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-white/50 text-xs mt-4"
      >
        বাংলাদেশের কৃষকদের জন্য
      </motion.p>
    </motion.div>
  )
}

export default function KrishiApp() {
  const { activeTab } = useKrishiStore()
  const [showSplash, setShowSplash] = useState(true)

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration failed silently
      })
    }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f5f5f0] max-w-lg mx-auto overflow-hidden"
      style={{ boxShadow: '0 0 30px rgba(0,0,0,0.1)' }}
    >
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <>
          <StatusBar />
          <AppBar />

          <main className="flex-1 overflow-y-auto custom-scroll">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <TabContent tab={activeTab} />
              </motion.div>
            </AnimatePresence>
          </main>

          <BottomNav />
        </>
      )}
    </div>
  )
}

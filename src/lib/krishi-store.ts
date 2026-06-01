import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  category?: string
}

export interface ScanResult {
  id: string
  imageUrl: string
  diagnosis: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  disease: string
  treatment: string
  timestamp: number
  cropId?: string
  plantPart?: string
  causalType?: string
  diagnosisMethod?: string
}

export interface FarmerProfile {
  name: string
  district: string
  crops: string[]
  farmSize: string
  experience: string
  phone: string
}

export type TabId = 'home' | 'chat' | 'analyzer' | 'tools' | 'learn' | 'profile'

interface KrishiState {
  activeTab: TabId
  setActiveTab: (tab: TabId) => void

  chatMessages: ChatMessage[]
  addChatMessage: (msg: ChatMessage) => void
  clearChat: () => void

  scanHistory: ScanResult[]
  addScanResult: (scan: ScanResult) => void
  clearScanHistory: () => void

  farmerProfile: FarmerProfile
  updateFarmerProfile: (profile: Partial<FarmerProfile>) => void

  isAnalyzing: boolean
  setIsAnalyzing: (v: boolean) => void

  isChatLoading: boolean
  setIsChatLoading: (v: boolean) => void

  toolsSubPage: string | null
  setToolsSubPage: (page: string | null) => void
}

const defaultProfile: FarmerProfile = {
  name: '',
  district: 'ঢাকা',
  crops: ['ধান', 'গম'],
  farmSize: '1-5 একর',
  experience: '5-10 বছর',
  phone: '',
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

const saveToStorage = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

export const useKrishiStore = create<KrishiState>((set, get) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab, toolsSubPage: tab === 'tools' ? get().toolsSubPage : null }),

  chatMessages: [],
  addChatMessage: (msg) => {
    const updated = [...get().chatMessages, msg]
    set({ chatMessages: updated })
    saveToStorage('krishi-chat', updated)
  },
  clearChat: () => {
    set({ chatMessages: [] })
    saveToStorage('krishi-chat', [])
  },

  scanHistory: [],
  addScanResult: (scan) => {
    const updated = [scan, ...get().scanHistory].slice(0, 20)
    set({ scanHistory: updated })
    saveToStorage('krishi-scans', updated)
  },
  clearScanHistory: () => {
    set({ scanHistory: [] })
    saveToStorage('krishi-scans', [])
  },

  farmerProfile: defaultProfile,
  updateFarmerProfile: (partial) => {
    const updated = { ...get().farmerProfile, ...partial }
    set({ farmerProfile: updated })
    saveToStorage('krishi-profile', updated)
  },

  isAnalyzing: false,
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),

  isChatLoading: false,
  setIsChatLoading: (v) => set({ isChatLoading: v }),

  toolsSubPage: null,
  setToolsSubPage: (page) => set({ toolsSubPage: page }),
}))

// Hydrate from localStorage on client
if (typeof window !== 'undefined') {
  const chat = loadFromStorage<ChatMessage[]>('krishi-chat', [])
  const scans = loadFromStorage<ScanResult[]>('krishi-scans', [])
  const profile = loadFromStorage<FarmerProfile>('krishi-profile', defaultProfile)
  useKrishiStore.setState({
    chatMessages: chat,
    scanHistory: scans,
    farmerProfile: profile,
  })
}

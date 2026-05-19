'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Trash2, Send, Mic, Sparkles, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKrishiStore, type ChatMessage } from '@/lib/krishi-store'
import { toast } from 'sonner'

const CATEGORY_CHIPS = [
  'ধান চাষ', 'রোগ নির্ণয়', 'সার পরামর্শ', 'আবহাওয়া',
  'বাজার মূল্য', 'কীটনাশক', 'মাটি পরীক্ষা', 'পানি সেচ',
]

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  gemini: { label: 'Gemini', color: 'bg-blue-100 text-blue-700' },
  openrouter: { label: 'OpenRouter', color: 'bg-purple-100 text-purple-700' },
  rules: { label: 'Rule-based', color: 'bg-amber-100 text-amber-700' },
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-krishi-green/10 shrink-0">
        <Bot className="w-4 h-4 text-krishi-green" />
      </div>
      <div className="chat-bubble-assistant flex items-center gap-1 py-3 px-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-krishi-green-light/60"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatTab() {
  const [input, setInput] = useState('')
  const [lastSource, setLastSource] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    chatMessages,
    addChatMessage,
    isChatLoading,
    setIsChatLoading,
    clearChat,
  } = useKrishiStore()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isChatLoading, scrollToBottom])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isChatLoading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }
    addChatMessage(userMsg)
    setInput('')
    setIsChatLoading(true)

    try {
      const history = chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      })

      const data = await res.json()
      const source = data.source || 'rules'
      setLastSource(source)

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'কোনো উত্তর পাওয়া যায়নি',
        timestamp: Date.now(),
        category: source,
      }
      addChatMessage(assistantMsg)
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'দুঃখিত, সংযোগে সমস্যা হয়েছে',
        timestamp: Date.now(),
      }
      addChatMessage(errorMsg)
    } finally {
      setIsChatLoading(false)
      inputRef.current?.focus()
    }
  }, [chatMessages, isChatLoading, addChatMessage, setIsChatLoading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleClearChat = () => {
    if (showClearConfirm) {
      clearChat()
      setLastSource(null)
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-krishi-green/10">
            <Bot className="w-5 h-5 text-krishi-green" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">কৃষি এআই চ্যাট</h2>
            {lastSource && (
              <Badge
                variant="secondary"
                className={`text-[10px] px-1.5 py-0 h-4 mt-0.5 ${SOURCE_LABELS[lastSource]?.color || ''}`}
              >
                <Wifi className="w-2.5 h-2.5 mr-0.5" />
                {SOURCE_LABELS[lastSource]?.label || lastSource}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearChat}
          className={`h-9 w-9 ${showClearConfirm ? 'text-red-500 bg-red-50' : 'text-muted-foreground'}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Category Chips */}
      <div className="px-3 py-2 flex gap-2 overflow-x-auto custom-scroll shrink-0 bg-white/50">
        {CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip}
            className="mat-chip ripple bg-krishi-green/8 text-krishi-green border border-krishi-green/20 hover:bg-krishi-green/15 whitespace-nowrap"
            onClick={() => setInput(chip)}
          >
            <Sparkles className="w-3 h-3" />
            {chip}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scroll px-4 py-3 space-y-3 bg-gradient-to-b from-white to-gray-50/50">
        {chatMessages.length === 0 && !isChatLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-3 text-center"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-krishi-green/10">
              <Bot className="w-8 h-8 text-krishi-green" />
            </div>
            <p className="text-muted-foreground text-sm">
              কৃষি সম্পর্কে যেকোনো প্রশ্ন করুন!
            </p>
            <p className="text-muted-foreground/60 text-xs">
              উপরের বিষয়গুলোতে ট্যাপ করে শুরু করুন
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-end gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-krishi-green/10 shrink-0 mb-0.5">
                    <Bot className="w-3.5 h-3.5 text-krishi-green" />
                  </div>
                  <div>
                    <div className="chat-bubble-assistant">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground/50 ml-1 mt-0.5 block">
                      {formatTime(msg.timestamp)}
                      {msg.category && SOURCE_LABELS[msg.category] && (
                        <span className="ml-1">• {SOURCE_LABELS[msg.category].label}</span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {msg.role === 'user' && (
                <>
                  <div className="chat-bubble-user">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 mr-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isChatLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 px-3 py-2.5 bg-white border-t border-border/50 elevation-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 text-muted-foreground"
            onClick={() => toast.info('শীঘ্রই আসছে')}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <div className="flex-1 flex items-center bg-gray-50 rounded-2xl border border-border/50 px-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="আপনার প্রশ্ন লিখুন..."
              disabled={isChatLoading}
              className="w-full h-10 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isChatLoading}
              className={`h-8 w-8 shrink-0 rounded-full transition-colors ${
                input.trim()
                  ? 'bg-krishi-green text-white hover:bg-krishi-green/90'
                  : 'text-gray-300'
              }`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { callGeminiChat, getActiveModelLabel } from '@/lib/gemini'

const BENGALI_RULES: Record<string, string> = {
  'ধান': 'ধান চাষের জন্য মাটির pH ৫.৫-৬.৫ হওয়া উচিত। সঠিক সময়ে সার প্রয়োগ করুন এবং পানি নিষ্কাশন নিশ্চিত করুন। বোরো মৌসুমে উন্নত জাত ব্যবহার করুন।',
  'গম': 'গম চাষের জন্য শীতকাল সবচেয়ে ভালো সময়। ডিএই সার প্রয়োগ করুন এবং সেচ ব্যবস্থা নিশ্চিত করুন।',
  'পাট': 'পাট চাষের জন্য বর্ষাকাল উপযুক্ত। টিএসপি ও এমপি সার ব্যবহার করুন। সময়মতো পাট তোলা গুরুত্বপূর্ণ।',
  'আলু': 'আলু চাষের জন্য শীতকাল সবচেয়ে ভালো। বীজ আলু ভালোভাবে কাটুন এবং সার প্রয়োগ করুন।',
  'সরিষা': 'সরিষা চাষের জন্য কার্তিক মাস উপযুক্ত। সঠিক মাত্রায় সার দিন এবং আগাছা পরিষ্কার করুন।',
  'পেঁয়াজ': 'পেঁয়াজ চাষের জন্য কার্তিক-অগ্রহায়ণ উপযুক্ত সময়। ভালো ফলনের জন্য সার ও সেচ ব্যবস্থা নিশ্চিত করুন।',
  'রোগ': 'গাছে রোগ দেখা দিলে দ্রুত কৃষি অফিসারের পরামর্শ নিন। সঠিক কীটনাশক ব্যবহার করুন এবং আক্রান্ত অংশ অপসারণ করুন।',
  'সার': 'মাটি পরীক্ষা করে সার প্রয়োগ করুন। জৈব সার ও রাসায়নিক সারের সমন্বয় করুন। অতিরিক্ত সার মাটির উর্বরতা কমায়।',
  'পানি': 'সেচ ব্যবস্থার উন্নয়ন করুন। ফুলো সেচের পরিবর্তে ড্রিপ সেচ ব্যবহার করুন। বৃষ্টির পানি সংরক্ষণ করুন।',
  'কীট': 'উপকারী পোকা সংরক্ষণ করুন। আলোর ফাঁদ ব্যবহার করুন। প্রয়োজনে জৈব কীটনাশক ব্যবহার করুন।',
}

function getRuleBasedResponse(message: string): string {
  const lower = message.toLowerCase()
  let response = ''

  for (const [keyword, advice] of Object.entries(BENGALI_RULES)) {
    if (lower.includes(keyword.toLowerCase()) || message.includes(keyword)) {
      response += advice + '\n\n'
    }
  }

  if (!response) {
    response = `কৃষি বিষয়ে আপনার প্রশ্নের জন্য ধন্যবাদ! আমি আপনাকে সাহায্য করতে পারি। অনুগ্রহ করে নিচের বিষয়গুলো সম্পর্কে জিজ্ঞাসা করুন:\n\n• ফসল চাষ (ধান, গম, পাট, আলু)\n• রোগ ও পোকামাকড় দমন\n• সার প্রয়োগ ও মাটি ব্যবস্থাপনা\n• পানি সেচ ব্যবস্থা\n• আবহাওয়া ও ফসল পরিকল্পনা\n\nআপনার নির্দিষ্ট সমস্যা বিস্তারিত বললে আরও ভালো পরামর্শ দিতে পারব।`
  }

  return response
}

async function callGemini(messages: {role: string; content: string}[]): Promise<{ text: string; model: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  try {
    const geminiMessages = messages.map(m => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      content: m.content,
    }))

    const result = await callGeminiChat(
      apiKey,
      geminiMessages,
      'তুমি কৃষি এআই (Krishi AI) — বাংলাদেশের কৃষকদের জন্য একটি কৃষি সহায়ক। সব উত্তর বাংলায় দাও। কৃষি, ফসল, আবহাওয়া, বাজার মূল্য, রোগ নির্ণয় সম্পর্কে বিস্তারিত ও ব্যবহারিক পরামর্শ দাও। সহজ ভাষায় কথা বলো।',
      { temperature: 0.7, maxOutputTokens: 1024 }
    )

    return result
  } catch {
    return null
  }
}

async function callOpenRouter(messages: {role: string; content: string}[]): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return null

  const models = [
    'google/gemma-3-27b-it:free',
    'meta-llama/llama-4-maverick:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
  ]

  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://krishiai.live',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'তুমি কৃষি এআই (Krishi AI) — বাংলাদেশের কৃষকদের জন্য একটি কৃষি সহায়ক। সব উত্তর বাংলায় দাও। কৃষি বিষয়ে বিস্তারিত ও ব্যবহারিক পরামর্শ দাও।' },
            ...messages
          ],
          max_tokens: 1024,
        })
      })

      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content
      if (text) return text
    } catch {
      continue
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    const messages = [
      ...(history || []).slice(-10),
      { role: 'user', content: message }
    ]

    // Tier 1: Gemini 2.5 Flash → 2.0 Flash (cascade)
    const geminiResponse = await callGemini(messages)
    if (geminiResponse) {
      return NextResponse.json({ response: geminiResponse.text, source: 'gemini', model: geminiResponse.model })
    }

    // Tier 2: OpenRouter Free
    const openRouterResponse = await callOpenRouter(messages)
    if (openRouterResponse) {
      return NextResponse.json({ response: openRouterResponse, source: 'openrouter' })
    }

    // Tier 3: Rule-based Bengali
    const ruleResponse = getRuleBasedResponse(message)
    return NextResponse.json({ response: ruleResponse, source: 'rules' })

  } catch (error) {
    console.error('Chat API error:', error)
    const ruleResponse = getRuleBasedResponse('')
    return NextResponse.json({ response: ruleResponse, source: 'rules' })
  }
}

# কৃষি এআই (Krishi AI)

> বাংলাদেশের কৃষকদের জন্য এআই চালিত স্মার্ট কৃষি সহায়ক — Bengali-first Agricultural AI Assistant

![Krishi AI](https://img.shields.io/badge/Krishi%20AI-v2.0-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=flat-square)

## ✨ Features

### 🏠 হোম (Home)
- Live dashboard with production stats
- Real-time weather widget with 3-day forecast
- Market prices for key crops (৳ BDT)
- Agricultural news feed
- Farmer testimonials

### 💬 এআই চ্যাট (AI Chat)
- 3-tier AI cascade: Gemini → OpenRouter → Rule-based Bengali
- 8 category quick-chips (ধান চাষ, রোগ নির্ণয়, সার পরামর্শ, etc.)
- Voice input button (coming soon)
- Chat history persisted in localStorage

### 🔬 ফসল বিশ্লেষক (Crop Analyzer)
- Upload or capture plant photos
- AI-powered disease diagnosis (Gemini 2.0 Vision)
- Severity levels: হালকা / মাঝারি / মারাত্মক / সংকটাপন্ন
- Confidence score with treatment recommendations
- Scan history (last 20 scans)

### 🧰 কৃষি সরঞ্জাম (Tools)
- **উদ্ভিদ স্বাস্থ্য** — Crop-specific symptom diagnosis
- **মাটি অডিট** — Soil health indicators (pH, NPK, organic matter)
- **ফসল পথিকা** — Crop library with seasonal info
- **কীটনাশক গাইড** — Safe pesticide usage guide

### 📚 শিক্ষা কেন্দ্র (Learn)
- Educational video collection
- Interactive disease diagnosis quiz game
- Government publications (BARI/DAE/BRRI)

### 👤 প্রোফাইল (Profile)
- Farmer profile: name, district, crops, farm size, experience
- All data persisted locally (no server required)
- Data export/clear options

## 🤖 AI Cascade (3-Tier Fallback)

| Tier | Provider | Model | Cost |
|------|----------|-------|------|
| 1 | Google AI Studio | Gemini 2.0 Flash | Free tier |
| 2 | OpenRouter | Gemma-3, Llama-4, Mistral | Free models |
| 3 | Rule-based | Bengali keyword matching | Zero |

The app **always works** — even without API keys, the rule-based tier provides Bengali agricultural advice.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Material Design tokens |
| **UI** | shadcn/ui + Custom Android-native components |
| **State** | Zustand + localStorage |
| **Animations** | Framer Motion |
| **AI** | z-ai-web-dev-sdk / Google AI / OpenRouter |
| **PWA** | Service Worker + Web App Manifest |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- (Optional) Gemini API key for AI features
- (Optional) OpenRouter API key for fallback AI

### Install

```bash
# Clone the repository
git clone https://github.com/moniruzjaman/krishi-ai.git
cd krishi-ai

# Install dependencies
npm install
# or: bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development
npm run dev
# Open http://localhost:3000
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | No | Google AI Studio key for Gemini 2.0 |
| `OPENROUTER_API_KEY` | No | OpenRouter key for free vision models |
| `DATABASE_URL` | No | SQLite connection (auto-configured) |

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel Dashboard → Settings → Environment Variables.

### Cloudflare Pages

The `functions/api/` directory contains Cloudflare Pages Functions. Connect your GitHub repo to Cloudflare Pages for automatic deployments.

### Docker

```bash
docker build -t krishi-ai .
docker run -p 3000:3000 krishi-ai
```

## 📱 PWA Installation

1. Open the app in Chrome/Edge on mobile
2. Tap "Add to Home Screen" when prompted
3. The app installs as a standalone app — no browser UI
4. Works offline with cached content

## 🔒 Security

- API keys are server-side only (never exposed to frontend)
- Input validation on all API endpoints
- CORS configured for production domains
- Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- Image upload size limit: 5MB
- Message length limit: 5000 characters

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main app (tab orchestrator)
│   ├── layout.tsx            # PWA metadata + viewport
│   ├── globals.css           # Material Design tokens
│   └── api/
│       ├── chat/route.ts     # 3-tier AI chat API
│       └── analyze/route.ts  # Crop image analysis API
├── components/krishi/
│   ├── HomeTab.tsx           # Home page
│   ├── ChatTab.tsx           # AI chat
│   ├── AnalyzerTab.tsx       # Crop analyzer
│   ├── ToolsTab.tsx          # Tools hub
│   ├── LearnTab.tsx          # Learn center
│   └── ProfileTab.tsx        # Farmer profile
├── components/ui/            # shadcn/ui components
└── lib/
    └── krishi-store.ts       # Zustand state management

public/
├── manifest.json             # PWA manifest
├── sw.js                     # Service worker
├── favicon.svg               # App icon
└── icon-192.png              # App icon (PNG)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License — free for personal and commercial use.

---

**কৃষি এআই** — বাংলাদেশের কৃষকদের জন্য, প্রযুক্তির সাথে 🌾

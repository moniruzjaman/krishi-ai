/**
 * Respiratory Tools — curated external tool registry (module)
 * -----------------------------------------------------------
 * Each entry points to a live, publicly-hosted open-source repository tool.
 * Platforms covered: GitHub Pages, Vercel, Cloudflare Pages, custom domain.
 *
 * This module is the single source of truth for the Respiratory Tools
 * sub-page in ToolsTab. Add/remove tools here only — no UI changes needed.
 */

export type ToolPlatform = 'GitHub Pages' | 'Vercel' | 'Cloudflare Pages' | 'Custom Domain'

export interface RespiratoryTool {
  id: string
  /** Bengali display name */
  title: string
  /** Bengali one-line description */
  subtitle: string
  /** Upstream repository (source of truth) */
  repo: string
  repoUrl: string
  /** Verified live URL on one of the supported hosting platforms */
  liveUrl: string
  platform: ToolPlatform
  /** What the tool actually does */
  purpose: string
}

export const RESPIRATORY_TOOLS: RespiratoryTool[] = [
  {
    id: 'rrest',
    title: 'RRest — শ্বাস-প্রশ্বাসের হার গণনা',
    subtitle: 'সিগন্যাল থেকে respiratory rate নির্ণয়ের অ্যালগরিদম',
    repo: 'peterhcharlton/RRest',
    repoUrl: 'https://github.com/peterhcharlton/RRest',
    liveUrl: 'https://peterhcharlton.github.io/RRest/',
    platform: 'GitHub Pages',
    purpose: 'Respiratory volume / flow signals থেকে শ্বাসের হার (breaths per minute) estimating করার reference algorithms। documentation ও demo GitHub Pages-এ live।',
  },
  {
    id: 'openventilator',
    title: 'OpenVentilator — উন্মুক্ত ভেন্টিলেটর',
    subtitle: 'COVID-19-কালীন open-source ventilator প্রকল্প',
    repo: 'popsolutions/openventilator',
    repoUrl: 'https://github.com/popsolutions/openventilator',
    liveUrl: 'https://openventilator.io',
    platform: 'Custom Domain',
    purpose: 'সম্পূর্ণ open-source respiratory care ecosystem — pressure generator, humidifier, patient circuit সহ ventilator design ও documentation।',
  },
  {
    id: 'vitallens',
    title: 'VitalLens — ভাইটাল সাইন বিশ্লেষণ',
    subtitle: 'হৃদস্পন্দন ও শ্বাসের হার estimation API',
    repo: 'Rouast-Labs/vitallens-python',
    repoUrl: 'https://github.com/Rouast-Labs/vitallens-python',
    liveUrl: 'https://www.rouast.com/api/',
    platform: 'Custom Domain',
    purpose: 'Video/websocket-based vital sign estimation (heart rate, HRV, respiratory rate) এর Python package ও hosted API documentation।',
  },
]

/** Quick check helper used by the UI to label platform badges */
export const platformBadgeClass: Record<ToolPlatform, string> = {
  'GitHub Pages': 'bg-krishi-sky/10 text-krishi-sky',
  Vercel: 'bg-krishi-earth/10 text-krishi-earth',
  'Cloudflare Pages': 'bg-krishi-amber/10 text-krishi-amber',
  'Custom Domain': 'bg-krishi-green/10 text-krishi-green',
}

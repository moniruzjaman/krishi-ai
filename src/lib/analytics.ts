/**
 * Privacy-respecting analytics — Plausible-compatible.
 *
 * Design rules (aligned with the app's "no personal data" stance):
 *   • No cookies, no localStorage user id, no fingerprinting.
 *   • No IP address is read or stored by us; Plausible hashes/truncates it
 *     server-side when self-hosted.
 *   • Honors "Do Not Track" (DNT) and "Global Privacy Control" (GPC).
 *   • Fully opt-in — nothing is sent until the user enables it.
 *   • If no endpoint is configured, every call is a no-op.
 *
 * Self-hosting options (all free / MIT):
 *   • Plausible CE — https://github.com/plausible/community-edition
 *   • Umami        — https://umami.is/docs
 *   • Any endpoint that accepts `POST /api/event` with the Plausible shape.
 */

const URL_KEY = 'krishi:analytics-url'
const ENABLED_KEY = 'krishi:analytics-on'

const CHANGE_EVENT = 'krishi:analytics-change'

/** Notifies React subscribers when the analytics preference changes. */
export function subscribeAnalytics(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}

function emitChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getAnalyticsUrl(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(URL_KEY)
    if (stored) return stored.replace(/\/+$/, '')
    const env = process.env.NEXT_PUBLIC_ANALYTICS_URL
    if (env) return env.replace(/\/+$/, '')
  } catch {
    // localStorage unavailable (private mode) — fall through
  }
  return null
}

export function setAnalyticsUrl(url: string | null) {
  try {
    if (url) localStorage.setItem(URL_KEY, url.replace(/\/+$/, ''))
    else localStorage.removeItem(URL_KEY)
  } catch {
    // ignore
  }
  emitChange()
}

export function isAnalyticsEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLED_KEY) === '1' && !!getAnalyticsUrl()
  } catch {
    return false
  }
}

export function setAnalyticsEnabled(on: boolean) {
  try {
    if (on) localStorage.setItem(ENABLED_KEY, '1')
    else localStorage.removeItem(ENABLED_KEY)
  } catch {
    // ignore
  }
  emitChange()
}

/** DNT and GPC both opt the user out. */
function trackingAllowed(): boolean {
  if (typeof navigator === 'undefined') return false
  const dnt =
    navigator.doNotTrack === '1' ||
    (window as unknown as { doNotTrack?: string }).doNotTrack === '1'
  const gpc = (
    navigator as unknown as { globalPrivacyControl?: boolean }
  ).globalPrivacyControl
  return !dnt && !gpc
}

interface AnalyticsEvent {
  name: string
  url?: string
  domain?: string
  props?: Record<string, string | number | boolean>
}

let queue: AnalyticsEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

async function flush() {
  flushTimer = null
  if (queue.length === 0) return
  const endpoint = getAnalyticsUrl()
  if (!endpoint || !isAnalyticsEnabled()) {
    queue = []
    return
  }
  if (!trackingAllowed()) {
    queue = []
    return
  }

  const events = queue.splice(0, queue.length)
  const domain =
    typeof window !== 'undefined' ? window.location.hostname : 'krishi-ai.app'

  try {
    await fetch(`${endpoint}/api/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        events.map((e) => ({
          name: e.name,
          url: e.url ?? (typeof window !== 'undefined' ? window.location.href : '/'),
          domain,
          props: e.props ?? {},
        }))
      ),
      keepalive: true,
    })
  } catch {
    // Analytics must never break the app — drop silently.
  }
}

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(flush, 1000)
}

export function track(
  name: string,
  props?: Record<string, string | number | boolean>
) {
  if (!getAnalyticsUrl() || !isAnalyticsEnabled()) return
  queue.push({ name, props })
  scheduleFlush()
}

export function trackPageview() {
  track('pageview', {
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
    referrer:
      typeof document !== 'undefined' && document.referrer
        ? 'external'
        : 'direct',
  })
}

/** Named events used across the app. */
export const Events = {
  TAB_OPEN: (tab: string) => track('tab_open', { tab }),
  CHAT_SEND: (source: string) => track('chat_send', { source }),
  ANALYSIS_START: (crop?: string) =>
    track('analysis_start', { crop: crop ?? 'unknown' }),
  ANALYSIS_DONE: (crop: string, confidence: number) =>
    track('analysis_done', { crop, confidence }),
  DISEASE_MATCH: (disease: string) => track('disease_match', { disease }),
  TOOL_OPEN: (tool: string) => track('tool_open', { tool }),
  SHARE: (channel: string) => track('share', { channel }),
  THEME_TOGGLE: (mode: string) => track('theme_toggle', { mode }),
  ANALYTICS_TOGGLE: (enabled: boolean) =>
    track('analytics_toggle', { enabled }),
}

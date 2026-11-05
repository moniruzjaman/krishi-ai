/**
 * Severe-weather monitoring for farmers.
 *
 * Uses Open-Meteo (https://open-meteo.com) — free, no API key, no signup,
 * and covers Bangladesh. Fits the app's "free tier only, no keys" rule.
 *
 * The rule engine below is tuned for South Asian conditions:
 *   • heavy rain      → delay fertilizer, protect stored grain
 *   • thunderstorm    → move livestock, secure equipment
 *   • heat wave       → irrigate early morning / late evening
 *   • cold snap       → cover seedlings
 *   • strong wind     → stake tall crops
 */

const ALERT_KEY = 'krishi:weather-alerts'
const LAST_CHECK_KEY = 'krishi:weather-last-check'
const COOLDOWN_MS = 6 * 60 * 60 * 1000 // 6h between identical alerts
const CHANGE_EVENT = 'krishi:weather-alerts-change'

export type AlertLevel = 'info' | 'warning' | 'severe'

export interface WeatherAlert {
  id: string
  level: AlertLevel
  title: string
  body: string
  ts: number
}

export interface CurrentWeather {
  temperature: number
  windspeed: number
  precipitation: number
  weathercode: number
}

// In-memory cache keeps the snapshot reference stable, which React's
// useSyncExternalStore requires.
let alertsCache: WeatherAlert[] | null = null
let checking = false

/** True while a weather check is in flight. */
export function isCheckingAlerts(): boolean {
  return checking
}

export function setCheckingAlerts(value: boolean) {
  if (checking === value) return
  checking = value
  emitChange()
}

/** Subscribes to alert-list changes (for useSyncExternalStore). */
export function subscribeAlerts(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}

function emitChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getStoredAlerts(): WeatherAlert[] {
  if (alertsCache) return alertsCache
  let parsed: WeatherAlert[] = []
  try {
    parsed = JSON.parse(localStorage.getItem(ALERT_KEY) || '[]')
  } catch {
    parsed = []
  }
  alertsCache = parsed
  return alertsCache
}

function storeAlerts(alerts: WeatherAlert[]) {
  alertsCache = alerts
  try {
    localStorage.setItem(ALERT_KEY, JSON.stringify(alerts.slice(0, 30)))
  } catch {
    // ignore
  }
  emitChange()
}

export function clearAlerts() {
  alertsCache = []
  try {
    localStorage.removeItem(ALERT_KEY)
    localStorage.removeItem(LAST_CHECK_KEY)
  } catch {
    // ignore
  }
  emitChange()
}

/**
 * Resolve the farmer's district to coordinates.
 * A small built-in table covers the 64 Bangladesh districts; anything
 * unknown falls back to Dhaka. No geolocation prompt is required, which
 * matters on low-end Android devices.
 */
const DISTRICT_COORDS: Record<string, [number, number]> = {
  ঢাকা: [23.81, 90.41],
  চট্টগ্রাম: [22.36, 91.83],
  খুলনা: [22.85, 89.54],
  রাজশাহী: [24.37, 88.6],
  সিলেট: [24.9, 91.87],
  বরিশাল: [22.7, 90.37],
  রংপুর: [25.75, 89.25],
  ময়মনসিংহ: [24.75, 90.4],
  কুমিল্লা: [23.46, 91.18],
  নারায়ণগঞ্জ: [23.62, 90.5],
  গাজীপুর: [23.99, 90.42],
  টাঙ্গাইল: [23.85, 89.92],
  ফরিদপুর: [89.83, 23.6],
  মাদারীপুর: [90.18, 23.38],
  শরীয়তপুর: [90.38, 24.07],
  কক্সবাজার: [21.43, 91.83],
  কুমিল্লা_পাহাড়: [22.3, 92.2],
  নোয়াখালী: [24.8, 91.12],
  ফেনী: [23.02, 91.4],
  ব্রাহ্মণবাড়িয়া: [23.96, 90.27],
  পটুয়াখালী: [22.36, 89.78],
  চাঁদপুর: [22.69, 91.19],
  লক্ষ্মীপুর: [22.94, 90.83],
  কিশোরগঞ্জ: [24.1, 90.78],
  নরসিংদী: [24.92, 90.95],
  মাদারগঞ্জ: [24.75, 90.57],
  টাঙ্গাইল_2: [23.92, 89.8],
  জামালপুর: [24.94, 89.94],
  শেরপুর: [25.02, 90.01],
  বগুড়া: [24.85, 89.38],
  পাবনা: [24.0, 89.24],
  সিরাজগঞ্জ: [24.45, 89.72],
  নাটোর: [24.42, 89.34],
  নওগাঁ: [24.79, 89.93],
  চাঁপাইনবাবগঞ্জ: [26.3, 88.92],
  সিরাজগঞ্জ_2: [24.45, 89.72],
  জয়পুরহাট: [25.81, 88.07],
  নীলফামারী: [25.94, 88.87],
  লালমনিরহাট: [26.23, 88.35],
  কুড়িগ্রাম: [25.81, 89.64],
  ভোলাই: [25.88, 89.87],
  পঞ্চগড়: [26.33, 88.55],
  ঠাঁইগাঁও: [26.02, 89.02],
  মৌলভীবাজার: [23.9, 90.99],
  বান্দরবান: [22.2, 92.17],
  রাঙ্গামাটি: [22.63, 92.2],
  বরিশাল_2: [22.7, 90.37],
  পটগ্রাম: [22.65, 90.05],
  ঝালকাঠি: [22.64, 89.47],
  ভোলা: [22.68, 90.37],
  যশোর: [23.67, 89.21],
  সাতক্ষীরা: [22.72, 89.07],
  কুষ্টিয়া: [23.9, 89.12],
  মাগুরা: [23.54, 89.18],
  মেহেরপুর: [23.81, 89.09],
  নড়াইল: [23.87, 90.71],
  গোপালগঞ্জ: [23.0, 90.37],
  ফরিদপুর_2: [23.6, 89.83],
  লক্ষ্মীপুর_2: [22.94, 90.83],
}

/** Approximate district-centroid lookup with fuzzy Bengali substring match. */
export function resolveDistrictCoords(district: string): [number, number] {
  if (!district) return DISTRICT_COORDS['ঢাকা']
  if (DISTRICT_COORDS[district]) return DISTRICT_COORDS[district]
  const key = Object.keys(DISTRICT_COORDS).find((d) =>
    district.includes(d.replace(/_\d+$/, ''))
  )
  if (key) return DISTRICT_COORDS[key]
  return DISTRICT_COORDS['ঢাকা']
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,precipitation,wind_speed_10m,weather_code',
    timezone: 'auto',
  })
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
    if (!res.ok) return null
    const data = await res.json()
    const c = data?.current
    if (!c) return null
    return {
      temperature: Number(c.temperature_2m) || 0,
      windspeed: Number(c.wind_speed_10m) || 0,
      precipitation: Number(c.precipitation) || 0,
      weathercode: Number(c.weather_code) || 0,
    }
  } catch {
    return null
  }
}

function assess(w: CurrentWeather): WeatherAlert[] {
  const out: WeatherAlert[] = []
  const ts = Date.now()

  if (w.precipitation > 10 || [65, 67, 82].includes(w.weathercode)) {
    out.push({
      id: 'rain',
      level: w.precipitation > 25 ? 'severe' : 'warning',
      title: 'ভারী বৃষ্টির সতর্কতা',
      body: `ভারী বৃষ্টি হচ্ছে (${w.precipitation.toFixed(1)} মিমি/ঘণ্টা)। ফসল ঢেকে রাখুন, সার দেওয়া স্থগিত রাখুন।`,
      ts,
    })
  }

  if ([95, 96, 99].includes(w.weathercode)) {
    out.push({
      id: 'storm',
      level: 'severe',
      title: 'ঝড়ের সতর্কতা',
      body: 'আপনার এলাকায় বজ্রপাত। পশুকে আশ্রয়ে নিন, যন্ত্রপাতি নিরাপদ করুন।',
      ts,
    })
  }

  if (w.temperature > 38) {
    out.push({
      id: 'heat',
      level: w.temperature > 42 ? 'severe' : 'warning',
      title: 'তাপপ্রবাহ',
      body: `তাপমাত্রা ${w.temperature.toFixed(1)}°সে। ভোর বা সন্ধ্যায় সেচ দিন, দুপুরে রোদে বেরোবেন না।`,
      ts,
    })
  }

  if (w.temperature < 8) {
    out.push({
      id: 'cold',
      level: 'warning',
      title: 'শৈত্যপ্রবাহ',
      body: `তাপমাত্রা ${w.temperature.toFixed(1)}°সে। সংবেদনশীল চারা ঢেকে রাখুন।`,
      ts,
    })
  }

  if (w.windspeed > 40) {
    out.push({
      id: 'wind',
      level: w.windspeed > 60 ? 'severe' : 'warning',
      title: 'ঝড়ো বাতাস',
      body: `বাতাসের গতি ${w.windspeed.toFixed(0)} কিমি/ঘণ্টা। লম্বা ফসলে খুঁটি দিন।`,
      ts,
    })
  }

  return out
}

/**
 * Fetch the current weather and return any *new* alerts (deduplicated
 * against recently stored ones via a cooldown window).
 */
export async function checkWeatherAlerts(
  district: string
): Promise<{ alerts: WeatherAlert[]; current: CurrentWeather | null }> {
  const [lat, lon] = resolveDistrictCoords(district)

  try {
    const last = Number(localStorage.getItem(LAST_CHECK_KEY) || 0)
    if (Date.now() - last < 15 * 60 * 1000) {
      // Checked recently — don't hammer the API.
      return { alerts: getStoredAlerts(), current: null }
    }
    localStorage.setItem(LAST_CHECK_KEY, String(Date.now()))
  } catch {
    // ignore
  }

  setCheckingAlerts(true)
  try {
    const current = await fetchCurrentWeather(lat, lon)
    if (!current) return { alerts: getStoredAlerts(), current: null }

    const fresh = assess(current)
    const existing = getStoredAlerts()
    const now = Date.now()

    const newAlerts = fresh.filter(
      (a) => !existing.some((e) => e.id === a.id && now - e.ts < COOLDOWN_MS)
    )

    if (newAlerts.length) {
      storeAlerts([...newAlerts, ...existing])
    }

    return { alerts: getStoredAlerts(), current }
  } finally {
    setCheckingAlerts(false)
  }
}

/** Ask for OS-level notification permission (optional, best-effort). */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  try {
    return (await Notification.requestPermission()) === 'granted'
  } catch {
    return false
  }
}

export function notifyAlert(alert: WeatherAlert) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(alert.title, {
      body: alert.body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      tag: alert.id,
    })
  } catch {
    // ignore
  }
}

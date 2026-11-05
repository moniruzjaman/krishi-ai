'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CloudLightning, Droplets, Thermometer, Wind, X, BellRing, BellOff } from 'lucide-react'
import { useKrishiStore } from '@/lib/krishi-store'
import {
  checkWeatherAlerts,
  clearAlerts,
  getStoredAlerts,
  isCheckingAlerts,
  notifyAlert,
  requestNotificationPermission,
  subscribeAlerts,
  type WeatherAlert,
} from '@/lib/weather-alerts'

const LEVEL_STYLE: Record<WeatherAlert['level'], string> = {
  info: 'bg-krishi-sky/10 text-krishi-sky border-krishi-sky/30',
  warning: 'bg-krishi-amber/10 text-krishi-amber border-krishi-amber/30',
  severe: 'bg-krishi-red/10 text-krishi-red border-krishi-red/30',
}

function AlertIcon({ id }: { id: string }) {
  const cls = 'w-5 h-5'
  switch (id) {
    case 'rain':
      return <Droplets className={cls} />
    case 'storm':
      return <CloudLightning className={cls} />
    case 'heat':
      return <Thermometer className={cls} />
    case 'wind':
      return <Wind className={cls} />
    default:
      return <AlertTriangle className={cls} />
  }
}

/**
 * Weather alert sheet, opened from the bell icon in the app bar.
 * Pulls the farmer's district from the profile store, checks
 * Open-Meteo for severe conditions, and shows any active alerts.
 */
export default function AlertSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { farmerProfile } = useKrishiStore()
  const [notifOn, setNotifOn] = useState(false)

  // Alert list and the in-flight flag both live in the lib — read them
  // through a subscription so no setState happens inside an effect.
  const alerts = useSyncExternalStore(
    subscribeAlerts,
    getStoredAlerts,
    () => [] as WeatherAlert[]
  )
  const loading = useSyncExternalStore(
    subscribeAlerts,
    isCheckingAlerts,
    () => false
  )

  const refresh = useCallback(async () => {
    const before = getStoredAlerts().map((a) => a.id)
    const { alerts: list } = await checkWeatherAlerts(farmerProfile.district)
    // Only notify for alerts that are genuinely new.
    list
      .filter((a) => !before.includes(a.id))
      .forEach(notifyAlert)
  }, [farmerProfile.district])

  useEffect(() => {
    if (!open) return
    let cancelled = false
    // Notification permission can only be read in the browser.
    if (typeof Notification !== 'undefined') {
      Promise.resolve().then(() => {
        if (!cancelled) setNotifOn(Notification.permission === 'granted')
      })
    }
    refresh()
    return () => {
      cancelled = true
    }
  }, [open, refresh])

  const handleNotifyToggle = async () => {
    if (notifOn) {
      setNotifOn(false)
      return
    }
    const granted = await requestNotificationPermission()
    setNotifOn(granted)
    if (granted) refresh()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg bg-background rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto custom-scroll"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">সতর্কতা</h2>
                <p className="text-xs text-muted-foreground">
                  {farmerProfile.district} জেলার আবহাওয়া অবস্থা
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <button
              onClick={handleNotifyToggle}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border mb-3 transition-colors ${
                notifOn
                  ? 'bg-krishi-green/10 border-krishi-green/30 text-krishi-green'
                  : 'bg-muted/50 border-border text-muted-foreground'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                {notifOn ? (
                  <BellRing className="w-4 h-4" />
                ) : (
                  <BellOff className="w-4 h-4" />
                )}
                {notifOn ? 'নোটিফিকেশন চালু' : 'নোটিফিকেশন চালু করুন'}
              </span>
              <span className="text-xs font-bold">
                {notifOn ? '✓' : 'বন্ধ'}
              </span>
            </button>

            {loading && alerts.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                আবহাওয়া যাচাই করা হচ্ছে...
              </div>
            )}

            {!loading && alerts.length === 0 && (
              <div className="py-8 text-center">
                <div className="text-4xl mb-2">🌤️</div>
                <p className="text-sm font-medium text-foreground">
                  এখন কোনো সতর্কতা নেই
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  আবহাওয়া স্বাভাবিক আছে। ঝড় বা ভারী বৃষ্টি হলে এখানে সতর্কতা দেখানো হবে।
                </p>
              </div>
            )}

            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={`${alert.id}-${alert.ts}`}
                  className={`flex items-start gap-3 p-3 rounded-2xl border ${LEVEL_STYLE[alert.level]}`}
                >
                  <span className="mt-0.5 shrink-0">
                    <AlertIcon id={alert.id} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{alert.title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed opacity-90">
                      {alert.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {alerts.length > 0 && (
              <button
                onClick={() => {
                  clearAlerts()
                }}
                className="w-full mt-4 py-2.5 rounded-2xl bg-muted text-sm font-medium text-muted-foreground active:scale-95 transition-transform"
              >
                সব সতর্কতা মুছে ফেলুন
              </button>
            )}

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              আবহাওয়ার তথ্য: Open-Meteo (ফ্রি, কোনো API কী ছাড়াই)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

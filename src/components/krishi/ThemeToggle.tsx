'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

// Mounted guard without a setState-in-effect: the server snapshot is
// `false`, the client snapshot is `true`, and React re-renders after
// hydration. This avoids the hydration mismatch that occurs when the
// server cannot know the user's stored theme.
const emptySubscribe = () => () => {}

/**
 * Light/dark theme switch.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    // Keep the same footprint as the real button so the app bar does not shift.
    return <div className={`w-9 h-9 rounded-full bg-white/10 ${className}`} />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active:bg-white/30 transition-colors ${className}`}
      aria-label={isDark ? 'উজ্জ্বল থিম' : 'অন্ধকার থিম'}
      title={isDark ? 'উজ্জ্বল থিম' : 'অন্ধকার থিম'}
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5 text-white" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-white" />
      )}
    </button>
  )
}

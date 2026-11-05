'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Wraps the app in next-themes so the `dark` class is toggled on <html>.
 * `attribute="class"` pairs with the `@custom-variant dark (&:is(.dark *))`
 * declaration in globals.css.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

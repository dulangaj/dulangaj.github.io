import { useState, useEffect } from 'react'

type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredPreference(): ThemePreference | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

/**
 * Manages light/dark theme.
 *
 * Priority:
 *   1. Explicit user preference (stored in localStorage + data-theme on <html>)
 *   2. OS / system prefers-color-scheme (CSS handles this automatically)
 *
 * `isDark` reflects the currently active visual state regardless of source.
 * `toggle` switches between dark and light, saving the choice to localStorage.
 * Calling `reset` removes the explicit choice and defers back to system.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference | null>(readStoredPreference)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = readStoredPreference()
    return stored !== null ? stored === 'dark' : getSystemDark()
  })

  // Apply data-theme attribute and keep isDark in sync whenever preference changes
  useEffect(() => {
    const root = document.documentElement
    if (preference === null) {
      root.removeAttribute('data-theme')
      setIsDark(getSystemDark())
    } else {
      root.setAttribute('data-theme', preference)
      setIsDark(preference === 'dark')
    }
    try {
      if (preference === null) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, preference)
      }
    } catch { /* storage unavailable */ }
  }, [preference])

  // Track system preference changes (only matters when no explicit preference)
  useEffect(() => {
    if (preference !== null) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [preference])

  const toggle = () => {
    setPreference((current) => {
      if (current === null) return isDark ? 'light' : 'dark'
      return current === 'dark' ? 'light' : 'dark'
    })
  }

  return { isDark, toggle }
}

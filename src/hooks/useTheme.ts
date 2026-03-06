import { useSyncExternalStore } from 'react'

type ThemePreference = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'
const THEME_EVENT = 'theme-preference-change'

interface ThemeSnapshot {
  preference: ThemePreference | null
  isDark: boolean
}

let cachedSnapshot: ThemeSnapshot | null = null

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStoredPreference(): ThemePreference | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function readSnapshot(): ThemeSnapshot {
  const preference = readStoredPreference()
  const nextSnapshot = {
    preference,
    isDark: preference !== null ? preference === 'dark' : getSystemDark(),
  }

  if (
    cachedSnapshot &&
    cachedSnapshot.preference === nextSnapshot.preference &&
    cachedSnapshot.isDark === nextSnapshot.isDark
  ) {
    return cachedSnapshot
  }

  cachedSnapshot = nextSnapshot
  return nextSnapshot
}

function applyPreference(preference: ThemePreference | null) {
  const root = document.documentElement

  if (preference === null) {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', preference)
  }

  try {
    if (preference === null) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, preference)
    }
  } catch {
    // Storage can be unavailable in privacy modes.
  }

  window.dispatchEvent(new Event(THEME_EVENT))
}

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleThemeChange = () => onStoreChange()
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onStoreChange()
    }
  }

  window.addEventListener(THEME_EVENT, handleThemeChange)
  window.addEventListener('storage', handleStorage)
  mediaQuery.addEventListener('change', handleThemeChange)

  return () => {
    window.removeEventListener(THEME_EVENT, handleThemeChange)
    window.removeEventListener('storage', handleStorage)
    mediaQuery.removeEventListener('change', handleThemeChange)
  }
}

function getServerSnapshot(): ThemeSnapshot {
  return {
    preference: null,
    isDark: false,
  }
}

/**
 * Shared light/dark theme state.
 *
 * Priority:
 *   1. Explicit user preference (stored in localStorage + data-theme on <html>)
 *   2. OS / system prefers-color-scheme
 *
 * All hook consumers subscribe to the same external snapshot so UI elements
 * and the Leaflet tile layer stay in sync immediately.
 */
export function useTheme() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot)

  const toggle = () => {
    const nextPreference =
      snapshot.preference === null
        ? (snapshot.isDark ? 'light' : 'dark')
        : (snapshot.preference === 'dark' ? 'light' : 'dark')

    applyPreference(nextPreference)
  }

  return {
    isDark: snapshot.isDark,
    toggle,
  }
}

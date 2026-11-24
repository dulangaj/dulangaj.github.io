import { useEffect, useState, useSyncExternalStore } from 'react'

/* ─── useToday ───────────────────────────────────────────────────────────── */
/* Prerender and hydration print the build day; today's date swaps in after  */
/* and ticks each minute, so a page built yesterday hydrates cleanly.         */

const [buildYear, buildMonth, buildDay] = __BUILD_DAY__.split('-').map(Number)
const buildDate = new Date(buildYear, buildMonth - 1, buildDay)
const subscribeNoop = () => () => {}

export function useToday() {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false)
  const [today, setToday] = useState(() => new Date())

  useEffect(() => {
    const tick = window.setInterval(() => setToday(new Date()), 60_000)
    return () => window.clearInterval(tick)
  }, [])

  return hydrated ? today : buildDate
}

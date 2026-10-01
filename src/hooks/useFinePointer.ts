import { useSyncExternalStore } from 'react'

/* ─── useFinePointer ─────────────────────────────────────────────────────── */
/* True only with a real mouse. Cursor-driven motion is off on touch, where  */
/* scrolls emit pointer events and load-in waves read as flicker.            */

const QUERY = '(hover: hover) and (pointer: fine)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function useFinePointer() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}

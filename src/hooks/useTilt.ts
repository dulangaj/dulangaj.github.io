import type { PointerEvent } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer } from '@/hooks/useFinePointer'

/* ─── useTilt ────────────────────────────────────────────────────────────── */
/* Images lean toward the pointer like a photo lifted off the desk. Spread   */
/* the result onto a motion element. Inert on touch.                         */

const SPRING = { stiffness: 220, damping: 24 }

export function useTilt(maxDeg = 8) {
  const fine = useFinePointer()
  const rotateX = useSpring(useMotionValue(0), SPRING)
  const rotateY = useSpring(useMotionValue(0), SPRING)
  if (!fine) return {}
  return {
    style: { rotateX, rotateY, transformPerspective: 800 },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * maxDeg * 2)
      rotateY.set(((e.clientX - r.left) / r.width - 0.5) * maxDeg * 2)
    },
    onPointerLeave: () => { rotateX.set(0); rotateY.set(0) },
  }
}

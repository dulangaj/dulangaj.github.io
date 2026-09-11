import type { PointerEvent } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── useTilt ────────────────────────────────────────────────────────────── */
/* Newsroom scheme: images lean toward the pointer like a photo lifted off   */
/* the desk. Returns props to spread onto a motion element; inert elsewhere. */

const SPRING = { stiffness: 220, damping: 24 }

export function useTilt(maxDeg = 8) {
  const rotateX = useSpring(useMotionValue(0), SPRING)
  const rotateY = useSpring(useMotionValue(0), SPRING)
  if (SiteConfig.paper.motion !== 'newsroom') return {}

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

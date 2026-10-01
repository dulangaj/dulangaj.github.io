import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

/* ─── Spotlight ──────────────────────────────────────────────────────────── */
/* Newsroom scheme: a soft crimson desk lamp that trails the pointer. Pure    */
/* decoration — hidden on touch devices via CSS.                              */

export function Spotlight() {
  const x = useSpring(useMotionValue(-1000), { stiffness: 120, damping: 22 })
  const y = useSpring(useMotionValue(-1000), { stiffness: 120, damping: 22 })

  useEffect(() => {
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  const background = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, var(--color-crimson), transparent 70%)`
  return <motion.div aria-hidden="true" className="spotlight" style={{ background }} />
}

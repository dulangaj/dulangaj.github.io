import { useEffect } from 'react'
import { motion }    from 'framer-motion'

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type NavDirection = 'forward' | 'back'

interface PageTransitionProps {
  children:  React.ReactNode
  direction: NavDirection
}

/* ─── Variants ───────────────────────────────────────────────────────────── */

// custom = NavDirection, threaded through AnimatePresence so the exiting page
// also receives the direction of the *new* navigation event.
const variants = {
  initial: (d: NavDirection) => ({
    rotateY:  d === 'forward' ? 90 : -90,
    opacity:  0,
  }),
  animate: {
    rotateY:    0,
    opacity:    1,
    transition: {
      rotateY: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },  // decelerate — page settles
      opacity: { duration: 0.12 },
    },
  },
  exit: (d: NavDirection) => ({
    rotateY:    d === 'forward' ? -90 : 90,
    opacity:    0,
    transition: {
      rotateY: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },  // accelerate — page lifts away
      opacity: { duration: 0.12, delay: 0.22 },
    },
  }),
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function PageTransition({ children, direction }: PageTransitionProps) {
  // Scroll to top on every page enter
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    // Outer div sets the 3D perspective for child transforms
    <div style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}>
      <motion.div
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          transformOrigin:    'center center',
          backfaceVisibility: 'hidden',
          willChange:         'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

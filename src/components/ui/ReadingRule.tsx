import { motion, useScroll } from 'framer-motion'
import { useFinePointer } from '@/hooks/useFinePointer'

/* ─── ReadingRule ────────────────────────────────────────────────────────── */
/* Newsroom scheme: a crimson rule along the top edge that lengthens with     */
/* the reader's progress — column inches read.                                */

export function ReadingRule() {
  return useFinePointer() ? <Rule /> : null
}

function Rule() {
  const { scrollYProgress } = useScroll()
  return <motion.div aria-hidden="true" className="reading-rule" style={{ scaleX: scrollYProgress }} />
}

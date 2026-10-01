import { motion, useScroll } from 'framer-motion'

/* ─── ReadingRule ────────────────────────────────────────────────────────── */
/* Newsroom scheme: a crimson rule along the top edge that lengthens with     */
/* the reader's progress — column inches read.                                */

export function ReadingRule() {
  const { scrollYProgress } = useScroll()
  return <motion.div aria-hidden="true" className="reading-rule" style={{ scaleX: scrollYProgress }} />
}

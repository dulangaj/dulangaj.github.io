import { motion } from 'framer-motion'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── Rule ───────────────────────────────────────────────────────────────── */
/* Printed rules: hairline, thick, or double. Under the press scheme each     */
/* rule is drawn left-to-right as it enters view, like a compositor laying    */
/* in brass rule.                                                             */

const weights = {
  hair:   'border-t',
  thick:  'border-t-2',
  double: 'border-t-4 border-double',
} as const

interface RuleProps {
  weight?: keyof typeof weights
  className?: string
}

export function Rule({ weight = 'hair', className = '' }: RuleProps) {
  const cls = `${weights[weight]} border-[var(--color-ink)] ${className}`
  if (SiteConfig.paper.motion !== 'press') return <div className={cls} />
  return (
    <motion.div
      className={`${cls} origin-left`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

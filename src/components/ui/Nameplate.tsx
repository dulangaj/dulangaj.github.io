import { motion } from 'framer-motion'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── Nameplate ──────────────────────────────────────────────────────────── */
/* The paper's name, set on load: each word rises out from behind the rule.   */
/* Touch devices get the final type, set still (see globals.css).             */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function Nameplate({ className }: { className: string }) {
  const name = SiteConfig.paper.name
  const words = name.split(' ')
  return (
    <p className={className}>
      <span className="sr-only">{name}</span>
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-pre overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span className="nameplate-word inline-block" initial={{ y: '110%' }} animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 + w * 0.12 }}>
            {word}
          </motion.span>
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}

/* The dateline arrives over the wire, one character at a time. */
export function Teletype({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={className} initial="hidden" animate="visible" transition={{ staggerChildren: 0.035, delayChildren: 0.6 }}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <motion.span key={i} aria-hidden="true" className="teletype-char whitespace-pre" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }}>
          {ch}
        </motion.span>
      ))}
      <span aria-hidden="true" className="teletype-caret">▍</span>
    </motion.span>
  )
}

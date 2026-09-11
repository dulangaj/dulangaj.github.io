import { motion } from 'framer-motion'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── Nameplate ──────────────────────────────────────────────────────────── */
/* The paper's name, set on load. Press: each sort is stamped into the sheet  */
/* in turn. Newsroom: each word rises out from behind the rule.               */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const isPress = SiteConfig.paper.motion === 'press'

const stamp = {
  hidden:  { opacity: 0, scale: 1.4, filter: 'blur(6px)' },
  visible: { opacity: 1, scale: 1,   filter: 'blur(0px)' },
}
const rise = { hidden: { y: '110%' }, visible: { y: 0 } }

export function Nameplate({ className }: { className: string }) {
  const name = SiteConfig.paper.name
  const words = name.split(' ')
  let sort = 0 // running letter index so the stamping never pauses between words

  return (
    <p aria-label={name} className={className}>
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className={`inline-block whitespace-pre ${isPress ? '' : 'overflow-hidden pb-[0.1em] -mb-[0.1em]'}`}>
          {isPress
            ? Array.from(word).map((ch, c) => (
                <motion.span key={c} className="inline-block" initial={stamp.hidden} animate={stamp.visible}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.15 + sort++ * 0.045 }}>
                  {ch}
                </motion.span>
              ))
            : <motion.span className="inline-block" initial={rise.hidden} animate={rise.visible}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 + w * 0.12 }}>
                {word}
              </motion.span>}
          {w < words.length - 1 && ' '}
        </span>
      ))}
    </p>
  )
}

/* Newsroom dateline arrives over the wire, one character at a time. */
export function Teletype({ text, className }: { text: string; className?: string }) {
  if (!isPress) {
    return (
      <motion.span aria-label={text} className={className} initial="hidden" animate="visible" transition={{ staggerChildren: 0.035, delayChildren: 0.6 }}>
        {Array.from(text).map((ch, i) => (
          <motion.span key={i} aria-hidden="true" className="whitespace-pre" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0 } } }}>
            {ch}
          </motion.span>
        ))}
        <span aria-hidden="true" className="teletype-caret">▍</span>
      </motion.span>
    )
  }
  return <span className={className}>{text}</span>
}

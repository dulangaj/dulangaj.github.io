import { motion } from 'framer-motion'

/* ─── AnimatedText ───────────────────────────────────────────────────────── */
/* Animates a string by splitting into words, each staggered into view.     */

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  once?: boolean
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  once = true,
}: AnimatedTextProps) {
  const words = text.split(' ')

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={{
        hidden:  {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.25em] last:mr-0"
          variants={{
            hidden:  { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

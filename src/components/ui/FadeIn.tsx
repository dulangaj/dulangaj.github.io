import { type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

/* ─── FadeIn ─────────────────────────────────────────────────────────────── */
/* Scroll-triggered fade + upward slide. Use to reveal any block of content. */

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  direction?: Direction
  distance?: number
  once?: boolean
  className?: string
}

function buildVariants(direction: Direction, distance: number) {
  const offset: Record<string, number> = {}
  if (direction === 'up')    offset.y =  distance
  if (direction === 'down')  offset.y = -distance
  if (direction === 'left')  offset.x =  distance
  if (direction === 'right') offset.x = -distance

  return {
    hidden:  { opacity: 0, ...offset },
    visible: { opacity: 1, y: 0, x: 0 },
  }
}

export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  distance = 32,
  once = true,
  className = '',
  ...rest
}: FadeInProps) {
  const variants = buildVariants(direction, distance)

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

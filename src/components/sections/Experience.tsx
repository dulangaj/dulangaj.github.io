import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import { experiences } from '@/data/experiences'
import { Experience as ExperienceModel } from '@/models/Experience'
import { FadeIn } from '@/components/ui/FadeIn'
import { Tag } from '@/components/ui/Tag'
import { SectionLabel } from '@/components/ui/SectionLabel'

/* ─── Experience ─────────────────────────────────────────────────────────── */
/* Vertical accordion timeline. Each entry expands on click.                 */

interface TimelineItemProps {
  experience: ExperienceModel
  index: number
  isOpen: boolean
  onToggle: () => void
}

function TimelineItem({ experience, index, isOpen, onToggle }: TimelineItemProps) {
  return (
    <FadeIn delay={0.08 * index} className="border-b border-[var(--color-rule)] last:border-b-0">
      {/* Header row — always visible, click to toggle */}
      <button
        className="w-full grid grid-cols-12 gap-4 md:gap-8 py-6 text-left cursor-pointer bg-transparent border-none group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {/* Year/period */}
        <div className="col-span-12 md:col-span-2 font-mono text-[11px] tracking-widest text-[var(--color-subtle)] pt-1">
          {experience.period}
        </div>

        {/* Role + company */}
        <div className="col-span-10 md:col-span-8 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span
              className={`font-display text-[1.2rem] leading-tight transition-colors duration-200 ${
                isOpen ? 'text-[var(--color-crimson)]' : 'text-[var(--color-ink)] group-hover:text-[var(--color-crimson)]'
              }`}
            >
              {experience.role}
            </span>
            {experience.isCurrent && (
              <span className="font-mono text-[10px] px-2 py-0.5 bg-[var(--color-crimson)] text-white rounded-full tracking-widest uppercase">
                Now
              </span>
            )}
          </div>
          <span className="font-body text-[13px] text-[var(--color-muted)]">
            {experience.company} &nbsp;·&nbsp; {experience.location}
          </span>
        </div>

        {/* Chevron */}
        <div className="col-span-2 md:col-span-2 flex items-center justify-end">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <FiChevronDown
              size={16}
              className={`transition-colors duration-200 ${
                isOpen ? 'text-[var(--color-crimson)]' : 'text-[var(--color-subtle)]'
              }`}
            />
          </motion.div>
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="pb-8 grid grid-cols-12 gap-4 md:gap-8">
              {/* Spacer to align with content column */}
              <div className="hidden md:block md:col-span-2" />

              <div className="col-span-12 md:col-span-8 flex flex-col gap-5">
                <p className="font-body text-[14px] text-[var(--color-muted)] leading-relaxed">
                  {experience.description}
                </p>

                <ul className="flex flex-col gap-2">
                  {experience.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--color-crimson)]" />
                      <span className="font-body text-[13px] text-[var(--color-ink)] leading-relaxed">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {experience.tags.map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeIn>
  )
}

export function Experience() {
  const [openId, setOpenId] = useState<string>(experiences[0]?.id ?? '')

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? '' : id))

  return (
    <section id="experience" className="px-6 md:px-12 py-24 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionLabel text="Experience" index="02" />
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[var(--color-ink)] mb-4 leading-tight">
            Where I've built.
          </h2>
          <p className="font-body text-[15px] text-[var(--color-muted)] mb-16 max-w-xl">
            4+ years across fintech, retail tech, and academic research — always shipping to production.
          </p>
        </FadeIn>

        {/* Timeline accordion */}
        <div className="border-t border-[var(--color-rule)]">
          {experiences.map((exp, i) => (
            <TimelineItem
              key={exp.id}
              experience={exp}
              index={i}
              isOpen={openId === exp.id}
              onToggle={() => toggle(exp.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

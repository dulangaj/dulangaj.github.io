import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowDownRight } from 'react-icons/fi'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── Hero ───────────────────────────────────────────────────────────────── */
/* Full-viewport landing section with staggered editorial text reveal.       */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const SocialIcon = {
  GitHub:   FiGithub,
  LinkedIn: FiLinkedin,
  Email:    FiMail,
} as const

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const lineVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const lineTransition = { duration: 0.7, ease: EASE }

export function Hero() {
  return (
    <section
      id="top"
      className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 pb-16"
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Main heading ─────────────────────────────────────────── */}
          <div className="md:col-span-9 flex flex-col gap-4">
            {/* Eyebrow */}
            <motion.div className="flex items-center gap-4" variants={lineVariants} transition={lineTransition}>
              <div className="h-px w-8 bg-[var(--color-crimson)]" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)]">
                Software Engineer
              </span>
            </motion.div>

            {/* Name — large display type */}
            <motion.h1
              className="font-display text-[clamp(3rem,8vw,7rem)] leading-[1.0] tracking-tight text-[var(--color-ink)]"
              variants={lineVariants}
              transition={lineTransition}
            >
              Dulanga
              <br />
              <span className="italic text-[var(--color-crimson)]">Jayawardena</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="font-body text-[clamp(1rem,2vw,1.25rem)] text-[var(--color-muted)] max-w-xl leading-relaxed"
              variants={lineVariants}
              transition={lineTransition}
            >
              {SiteConfig.tagline}
            </motion.p>
          </div>

          {/* ── Side panel ────────────────────────────────────────────── */}
          <div className="md:col-span-3 flex flex-col justify-end gap-6">
            {/* Profile photo */}
            <motion.div
              className="relative w-20 h-20 md:w-24 md:h-24"
              variants={lineVariants}
              transition={lineTransition}
            >
              {/* Crimson accent ring — offset slightly for depth */}
              <div className="absolute -inset-[3px] rounded-full border border-[var(--color-crimson)] opacity-60" />
              <div
                className="
                  w-full h-full rounded-full overflow-hidden
                  bg-[var(--color-rule)]
                  ring-2 ring-[var(--color-surface)]
                  transition-transform duration-300 ease-out
                  hover:scale-[1.04]
                "
              >
                <img
                  src="/profile.jpg"
                  alt="Dulanga Jayawardena"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget
                    el.style.display = 'none'
                    const fallback = el.nextElementSibling as HTMLElement | null
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                {/* Initials fallback — hidden by default, shown via onError */}
                <div
                  className="w-full h-full items-center justify-center font-display text-lg text-[var(--color-muted)] select-none"
                  style={{ display: 'none' }}
                >
                  DJ
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.p
              className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed"
              variants={lineVariants}
              transition={lineTransition}
            >
              {SiteConfig.bio}
            </motion.p>

            {/* Social links */}
            <motion.div className="flex items-center gap-5" variants={lineVariants} transition={lineTransition}>
              {SiteConfig.socials.map((social) => {
                const Icon = SocialIcon[social.platform as keyof typeof SocialIcon]
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.platform !== 'Email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200"
                  >
                    {Icon && <Icon size={18} />}
                  </a>
                )
              })}
            </motion.div>

            {/* Location */}
            <motion.div
              className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-subtle)]"
              variants={lineVariants}
              transition={lineTransition}
            >
              {SiteConfig.location}
            </motion.div>
          </div>

          {/* ── Horizontal rule with scroll cue ───────────────────────── */}
          <motion.div
            className="md:col-span-12 flex items-center justify-between pt-8 border-t border-[var(--color-rule)]"
            variants={lineVariants}
            transition={lineTransition}
          >
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-subtle)]">
              Scroll to explore
            </span>
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              Projects
              <FiArrowDownRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiMail, FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi'
import { SiteConfig } from '@/models/SiteConfig'
import { photoLocations } from '@/data/photoLocations'

/* ─── Hero ───────────────────────────────────────────────────────────────── */
/* Full-viewport landing section with staggered editorial text reveal.       */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const mapPaper = SiteConfig.paper.map

/* Two-deck headline: given name over family name */
const [givenName, ...familyNameParts] = SiteConfig.name.split(' ')
const familyName = familyNameParts.join(' ')

/* Front-page index in folio order — the Datelines page ('C') files between
   the inside pages and the back page ('Z') */
const indexEntries = [
  ...SiteConfig.paper.sections.map((s) => ({
    key: s.id, label: s.label, folio: s.folio, anchor: s.id, route: null as string | null,
  })),
  { key: 'map', label: mapPaper.label, folio: mapPaper.folio, anchor: null, route: '/map/' },
].sort((a, b) => a.folio.localeCompare(b.folio))

const indexLinkClass = 'group flex w-full items-baseline gap-2 p-0 text-left'

function IndexLine({ label, folio }: { label: string; folio: string }) {
  return (
    <>
      <span className="font-serif text-[13px] text-[var(--color-muted)] group-hover:text-[var(--color-crimson)] transition-colors duration-150">
        {label}
      </span>
      <span aria-hidden="true" className="flex-1 border-b border-dotted border-[var(--color-subtle)] opacity-50" />
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
        {folio}
      </span>
    </>
  )
}

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
      className="flex flex-col justify-center px-6 md:px-12 pt-12 md:pt-16 pb-16"
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
            {/* Kicker — newspaper-style section + byline */}
            <motion.div className="flex flex-wrap items-baseline gap-3" variants={lineVariants} transition={lineTransition}>
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-crimson)]">
                {SiteConfig.paper.sections[0].folio} · {SiteConfig.paper.hero.kicker}
              </span>
              <span className="h-px w-6 bg-[var(--color-rule)] hidden md:inline-block" />
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)]">
                By {SiteConfig.name}
              </span>
            </motion.div>

            {/* Name — large display type (page H1) */}
            <motion.h1
              className="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.0] tracking-tight text-[var(--color-ink)]"
              variants={lineVariants}
              transition={lineTransition}
            >
              {givenName}
              <br />
              {familyName}<span className="text-[var(--color-crimson)]">.</span>
            </motion.h1>

            {/* Byline + Dateline */}
            <motion.p
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-subtle)]"
              variants={lineVariants}
              transition={lineTransition}
            >
              <span className="text-[var(--color-ink)]">{SiteConfig.location}</span>
              <span className="mx-2">—</span>
              <span>{SiteConfig.title} at {SiteConfig.employer}</span>
            </motion.p>

            {/* Lede with drop cap */}
            {SiteConfig.lede.map((paragraph, idx) => (
              <motion.p
                key={idx}
                className={`${idx === 0 ? 'hero-lede ' : ''}font-serif text-[17px] md:text-[18px] text-[var(--color-muted)] max-w-xl leading-[1.65]`}
                variants={lineVariants}
                transition={lineTransition}
              >
                {paragraph}
              </motion.p>
            ))}
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
                  src="/assets/img/profile.jpeg"
                  alt={SiteConfig.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
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
                  {SiteConfig.initials}
                </div>
              </div>
            </motion.div>

            {/* Bio — set as a cutline under the portrait */}
            <motion.p
              className="font-serif italic text-[13px] text-[var(--color-muted)] leading-relaxed"
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

            {/* Inside this Issue — classic front-page index */}
            <motion.nav
              aria-label="Inside this issue"
              variants={lineVariants}
              transition={lineTransition}
            >
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-ink)] border-t-2 border-[var(--color-ink)] pt-2 mb-3">
                {SiteConfig.paper.hero.indexHeading}
              </p>
              <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
                {indexEntries.map((entry) => (
                  <li key={entry.key}>
                    {entry.route ? (
                      <Link to={entry.route} className={indexLinkClass}>
                        <IndexLine label={entry.label} folio={entry.folio} />
                      </Link>
                    ) : (
                      <a
                        href={`/#${entry.anchor}`}
                        onClick={(event) => {
                          event.preventDefault()
                          document.querySelector(`#${entry.anchor}`)?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className={indexLinkClass}
                      >
                        <IndexLine label={entry.label} folio={entry.folio} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.nav>

            {/* Datelines refer — boxed front-page promo for the picture section */}
            <motion.div variants={lineVariants} transition={lineTransition}>
              <Link
                to="/map/"
                className="group block border border-[var(--color-ink)] px-3 py-3"
              >
                <p className="m-0 font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-crimson)]">
                  {mapPaper.label}
                </p>
                <p className="mt-1.5 mb-0 font-serif text-[13px] leading-relaxed text-[var(--color-muted)]">
                  {mapPaper.refer.body}
                </p>
                <p className="mt-2.5 mb-0 flex items-baseline justify-between gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
                  <span>{photoLocations.length} {mapPaper.counterNoun}</span>
                  <span className="flex items-center gap-1 text-[var(--color-muted)] group-hover:text-[var(--color-crimson)] transition-colors duration-200">
                    {mapPaper.refer.cta} {mapPaper.folio}
                    <FiArrowUpRight size={12} />
                  </span>
                </p>
              </Link>
            </motion.div>
          </div>

          {/* ── Jump line — newspaper "continued on page" cue ──────── */}
          <motion.div
            className="md:col-span-12 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between pt-8 border-t border-[var(--color-ink)]"
            variants={lineVariants}
            transition={lineTransition}
          >
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)]">
              {SiteConfig.paper.hero.foldNote}
            </span>
            <button
              onClick={() => document.querySelector('#featured')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              {SiteConfig.paper.hero.foldCta}
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

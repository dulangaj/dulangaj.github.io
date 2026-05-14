import { SiteConfig } from '@/models/SiteConfig'

/* ─── Footer / Colophon ──────────────────────────────────────────────────── */
/* The closing plate of the paper: publisher's note on the left, "By Cable"   */
/* directory in the middle, Letters to the Editor on the right. Bracketed by  */
/* a printed triple rule top and bottom.                                      */

const COLOPHON = 'Set in Playfair Display, Inter, and JetBrains Mono. Printed nightly to a GitHub Pages press.'

function findSocial(platform: string) {
  return SiteConfig.socials.find((s) => s.platform === platform)
}

const CHANNELS = [
  { key: 'cable',   label: 'By Cable',  hint: 'LinkedIn', platform: 'LinkedIn' },
  { key: 'wire',    label: 'By Wire',   hint: 'GitHub',   platform: 'GitHub'   },
  { key: 'post',    label: 'By Post',   hint: 'Email',    platform: 'Email'    },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      className="mt-32 px-6 md:px-12"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top: printed triple rule */}
        <div className="border-t-2 border-[var(--color-ink)]" />
        <div className="border-t border-[var(--color-ink)] mt-[3px]" />

        {/* Section banner */}
        <div className="flex items-baseline justify-between pt-4 pb-2">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)]">
              Page Z
            </span>
            <span aria-hidden="true" className="text-[var(--color-crimson)] font-display text-[14px] leading-none">❦</span>
            <span className="font-display text-[1.05rem] tracking-wide text-[var(--color-ink)]">
              Colophon
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)] hidden sm:block">
            The back page
          </span>
        </div>

        <div className="border-b border-[var(--color-ink)] mb-8" />

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12">

          {/* ── Publisher's note ─────────────────────────────────── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)] mb-3">
              The Publisher
            </p>
            <p className="font-display text-[1.4rem] text-[var(--color-ink)] mb-1 leading-tight">
              {SiteConfig.name}
            </p>
            <p className="font-display italic text-[14px] text-[var(--color-muted)] mb-4">
              Editor &amp; sole correspondent, {SiteConfig.location}.
            </p>
            <p className="font-body text-[13px] leading-relaxed text-[var(--color-muted)]">
              {COLOPHON}
            </p>
          </div>

          {/* ── Channels: cable / wire / post ────────────────────── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)] mb-3">
              Address the Editor
            </p>
            <ul className="flex flex-col gap-3">
              {CHANNELS.map((channel) => {
                const social = findSocial(channel.platform)
                if (!social) return null
                return (
                  <li key={channel.key} className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-ink)] w-[68px] shrink-0">
                      {channel.label}
                    </span>
                    <span className="font-display text-[13px] text-[var(--color-rule)]">·</span>
                    <a
                      href={social.url}
                      target={channel.platform === 'Email' ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="font-display italic text-[14px] text-[var(--color-ink)] hover:text-[var(--color-crimson)] transition-colors"
                    >
                      {channel.hint}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ── Letters to the Editor ────────────────────────────── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)] mb-3">
              Letters to the Editor
            </p>
            <p className="font-body text-[13px] leading-relaxed text-[var(--color-muted)] mb-4">
              Corrections, commissions, and correspondence are welcome. Mark your envelope
              <span className="font-mono text-[12px] tracking-wide text-[var(--color-ink)]"> RE: </span>
              the article in question.
            </p>
            <a
              href={SiteConfig.mailtoLink}
              className="inline-block font-display italic text-[15px] text-[var(--color-crimson)] hover:text-[var(--color-crimson-hover)] underline underline-offset-4 decoration-[var(--color-crimson)]"
            >
              {SiteConfig.email}
            </a>
          </div>
        </div>

        {/* Bottom plate — printer's mark / circulation / copyright */}
        <div className="border-t border-[var(--color-ink)] pt-3">
          <div className="border-t-2 border-[var(--color-ink)] mt-[3px]" />
          <div className="pt-3 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
            <span>
              © {year} {SiteConfig.name} &nbsp;·&nbsp; All rights reserved
            </span>
            <span className="font-display italic normal-case tracking-normal text-[13px] text-[var(--color-muted)]">
              ※ Composed by hand in Hong Kong ※
            </span>
            <span>Printed in HTML &amp; CSS &nbsp;·&nbsp; No. {String(year).slice(-2)}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

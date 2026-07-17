import { SiteConfig } from '@/models/SiteConfig'
import { SectionBanner } from '@/components/ui/SectionBanner'

/* ─── Footer / Colophon ──────────────────────────────────────────────────── */
/* The closing plate of the paper: publisher's note on the left, "By Cable"   */
/* directory in the middle, Letters to the Editor on the right. Bracketed by  */
/* a printed triple rule top and bottom.                                      */

const paper = SiteConfig.paper
const backPage = paper.sections.find((s) => s.id === 'contact')!

function findSocial(platform: string) {
  return SiteConfig.socials.find((s) => s.platform === platform)
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      className="mt-16 px-6 md:px-12"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section banner — shared masthead template, single closing rule */}
        <div className="mb-8">
          <SectionBanner
            folio={backPage.folio}
            label={backPage.bannerLabel ?? backPage.label}
            note={backPage.note}
            bottomRule="single"
          />
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12">

          {/* ── Publisher's note ─────────────────────────────────── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)] mb-3">
              {paper.publisher.heading}
            </p>
            <p className="font-display text-[1.4rem] text-[var(--color-ink)] mb-1 leading-tight">
              {SiteConfig.name}
            </p>
            <p className="font-display italic text-[14px] text-[var(--color-muted)] mb-4">
              {SiteConfig.title}, {SiteConfig.location}.
            </p>
            <p className="font-body text-[13px] leading-relaxed text-[var(--color-muted)] mb-4">
              {paper.publisher.note}
            </p>
            <p className="font-body text-[13px] leading-relaxed text-[var(--color-muted)]">
              {paper.colophon}
            </p>
          </div>

          {/* ── Channels: cable / wire / post ────────────────────── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)] mb-3">
              {paper.channels.heading}
            </p>
            <ul className="flex flex-col gap-3">
              {paper.channels.routes.map((channel) => {
                const social = findSocial(channel.platform)
                if (!social) return null
                return (
                  <li key={channel.platform} className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-ink)] w-[84px] shrink-0 whitespace-nowrap">
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
                      {channel.platform}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* ── Letters to the Editor ────────────────────────────── */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)] mb-3">
              {paper.letters.heading}
            </p>
            <p className="font-serif italic text-[14px] leading-[1.7] text-[var(--color-muted)] mb-4">
              {paper.letters.note}
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
              {SiteConfig.location}
            </span>
            <span>{paper.imprint}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

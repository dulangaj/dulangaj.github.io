import { SiteConfig } from '@/models/SiteConfig'

/* ─── SectionBanner ──────────────────────────────────────────────────────── */
/* The full-width section masthead used at the top of every "page" of the     */
/* paper: printed double rule, folio + fleuron + section name on the left,    */
/* an annotation on the right, closed by a bottom rule. One template shared   */
/* by Featured, Footer, PostDetail, and the writing archive so every banner   */
/* stays on the same printing scheme.                                         */

interface SectionBannerProps {
  folio: string
  label: string
  note?: string
  bottomRule?: 'double' | 'single'
  labelAs?: 'span' | 'h1' | 'h2'  // semantic element for the label (page heading vs. decoration)
}

export function SectionBanner({ folio, label, note, bottomRule = 'double', labelAs: LabelTag = 'span' }: SectionBannerProps) {
  const bottomClass =
    bottomRule === 'double'
      ? 'border-b-2 border-[var(--color-ink)]'
      : 'border-b border-[var(--color-ink)]'

  return (
    <div className="border-t-2 border-[var(--color-ink)]">
      <div className="border-t border-[var(--color-ink)] mt-[3px]" />
      <div className={`flex items-baseline justify-between pt-3 pb-3 ${bottomClass}`}>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)]">
            Page {folio}
          </span>
          <span aria-hidden="true" className="text-[var(--color-crimson)] font-display text-[14px] leading-none">
            {SiteConfig.paper.fleuron}
          </span>
          <LabelTag className="font-display text-[1.1rem] tracking-wide text-[var(--color-ink)] m-0 font-normal">
            {label}
          </LabelTag>
        </div>
        {note && (
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)] hidden sm:block">
            {note}
          </span>
        )}
      </div>
    </div>
  )
}

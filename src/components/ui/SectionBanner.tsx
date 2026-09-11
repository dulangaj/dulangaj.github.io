import { motion } from 'framer-motion'
import { SiteConfig } from '@/models/SiteConfig'
import { Rule } from '@/components/ui/Rule'

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
    <div>
      <Rule weight="thick" />
      <Rule className="mt-[3px]" />
      <div className={`flex items-baseline justify-between pt-3 pb-3 ${bottomClass}`}>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)]">
            Page {folio}
          </span>
          <motion.span
            aria-hidden="true"
            className="text-[var(--color-crimson)] font-display text-[14px] leading-none inline-block"
            initial={{ rotate: -180, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {SiteConfig.paper.fleuron}
          </motion.span>
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

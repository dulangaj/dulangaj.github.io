/* ─── SectionLabel ───────────────────────────────────────────────────────── */
/* A newspaper folio: PAGE A·n on the left, hairline rule, then the section   */
/* name in small caps. Replaces the old crimson-ruled eyebrow.                */

interface SectionLabelProps {
  text: string
  index?: string   // e.g. "02" — used as the page-number suffix
}

function folio(index?: string): string {
  if (!index) return 'PAGE A'
  // Strip leading zeros so "02" reads "A2" not "A02".
  const stripped = index.replace(/^0+/, '') || '0'
  return `PAGE A${stripped}`
}

export function SectionLabel({ text, index }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-subtle)]">
        {folio(index)}
      </span>
      <span aria-hidden="true" className="text-[var(--color-crimson)] font-display text-[14px] leading-none">
        ❦
      </span>
      <span className="flex-1 h-px bg-[var(--color-ink)]" />
      <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[var(--color-ink)]">
        {text}
      </span>
    </div>
  )
}

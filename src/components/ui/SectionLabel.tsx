/* ─── SectionLabel ───────────────────────────────────────────────────────── */
/* The small crimson-ruled eyebrow above each section heading.               */

interface SectionLabelProps {
  text: string
  index?: string   // e.g. "01"
}

export function SectionLabel({ text, index }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {index && (
        <span className="font-mono text-[11px] text-[var(--color-subtle)] tracking-widest">
          {index}
        </span>
      )}
      <div className="h-px w-8 bg-[var(--color-crimson)]" />
      <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)]">
        {text}
      </span>
    </div>
  )
}

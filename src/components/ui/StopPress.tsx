import { nowConfig } from '@/data/now'

/* ─── StopPress ──────────────────────────────────────────────────────────── */
/* The slim newspaper bulletin that ran across the top of the page in the     */
/* moments before a paper went to press. Latest field reports, set in small   */
/* caps and separated by typographer's daggers.                               */

const LABEL = 'Stop Press'

export function StopPress() {
  if (nowConfig.items.length === 0) return null

  return (
    <aside
      aria-label="Late bulletins"
      className="border-y border-[var(--color-ink)] bg-[var(--color-paper)]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-2 flex items-stretch gap-0 overflow-x-auto">
        <span
          className="
            shrink-0 self-center mr-5 px-2 py-1
            font-mono text-[10px] tracking-[0.28em] uppercase
            text-[var(--color-paper)] bg-[var(--color-crimson)]
          "
        >
          {LABEL}
        </span>

        <div className="flex items-center text-[var(--color-ink)]">
          {nowConfig.items.map((item, idx) => (
            <span key={item.label} className="flex items-center whitespace-nowrap">
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className="mx-4 font-display text-[14px] text-[var(--color-crimson)]"
                >
                  †
                </span>
              )}
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)] mr-2">
                {item.label}
              </span>
              <span className="font-display italic text-[13px] text-[var(--color-ink)]">
                {item.value}
              </span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

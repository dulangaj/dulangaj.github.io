import { useTheme } from '@/hooks/useTheme'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── EditionToggle ──────────────────────────────────────────────────────── */
/* Newspapers ran a Morning Edition (pale newsprint) and an Evening Edition   */
/* (set later in darker stock). This toggle frames light/dark as the two      */
/* press runs of the day. Both options are always visible; the active one     */
/* is highlighted so it reads as a two-state switch, not static metadata.     */

const editions = SiteConfig.paper.editions

export function EditionToggle() {
  const { isDark, toggle } = useTheme()
  const aria = `Switch to ${isDark ? editions.light.name : editions.dark.name}`

  return (
    <button
      onClick={toggle}
      aria-label={aria}
      title={aria}
      className="
        group inline-flex items-center gap-1 px-2 py-1
        font-mono text-[10px] tracking-[0.22em] uppercase
        hover:text-[var(--color-crimson)]
        bg-transparent border-none cursor-pointer
        transition-colors duration-150
      "
    >
      <span
        aria-hidden="true"
        className={`transition-colors duration-150 ${
          !isDark
            ? 'text-[var(--color-ink)] group-hover:text-[var(--color-crimson)]'
            : 'text-[var(--color-subtle)]'
        }`}
      >
        {editions.light.abbr}
      </span>
      <span aria-hidden="true" className="text-[var(--color-subtle)]">/</span>
      <span
        aria-hidden="true"
        className={`transition-colors duration-150 ${
          isDark
            ? 'text-[var(--color-ink)] group-hover:text-[var(--color-crimson)]'
            : 'text-[var(--color-subtle)]'
        }`}
      >
        {editions.dark.abbr}
      </span>
    </button>
  )
}

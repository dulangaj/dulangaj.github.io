import { useTheme } from '@/hooks/useTheme'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── EditionToggle ──────────────────────────────────────────────────────── */
/* Newspapers ran a Morning Edition (pale newsprint) and an Evening Edition   */
/* (set later in darker stock). This toggle frames light/dark as the two      */
/* press runs of the day. Both options are always visible; the active one     */
/* is highlighted so it reads as a two-state switch, not static metadata.     */

const editions = SiteConfig.paper.editions

function Abbrs({ isDark }: { isDark: boolean }) {
  return (
    <>
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
    </>
  )
}

export function EditionToggle() {
  const { isDark, toggle } = useTheme()
  /* Starts with the visible text so voice-control users can say what they see */
  const aria = `${editions.light.abbr}/${editions.dark.abbr}, switch to ${isDark ? editions.light.name : editions.dark.name}`

  return (
    <button
      onClick={toggle}
      aria-label={aria}
      title={aria}
      className="
        group inline-flex items-center gap-1 px-2 min-h-11 md:min-h-0 md:py-1
        font-mono text-[10px] tracking-[0.22em] uppercase
        hover:text-[var(--color-crimson)]
        bg-transparent border-none cursor-pointer
        transition-colors duration-150
      "
    >
      {/* Both states render; globals.css shows the one matching the theme */}
      <span className="edition-light"><Abbrs isDark={false} /></span>
      <span className="edition-dark"><Abbrs isDark /></span>
    </button>
  )
}

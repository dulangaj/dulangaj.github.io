import { useTheme } from '@/hooks/useTheme'

/* ─── EditionToggle ──────────────────────────────────────────────────────── */
/* Newspapers ran a Morning Edition (pale newsprint) and an Evening Edition   */
/* (set later in darker stock). This toggle frames light/dark as the two      */
/* press runs of the day.                                                     */

export function EditionToggle() {
  const { isDark, toggle } = useTheme()
  const label = isDark ? 'Evening Edition' : 'Morning Edition'
  const aria = isDark ? 'Switch to Morning Edition' : 'Switch to Evening Edition'

  return (
    <button
      onClick={toggle}
      aria-label={aria}
      title={aria}
      className="
        group inline-flex items-center gap-2 px-2 py-1
        font-mono text-[10px] tracking-[0.22em] uppercase
        text-[var(--color-muted)] hover:text-[var(--color-crimson)]
        bg-transparent border-none cursor-pointer
        transition-colors duration-150
      "
    >
      <span
        aria-hidden="true"
        className="
          inline-block w-1.5 h-1.5
          border border-[var(--color-muted)]
          group-hover:border-[var(--color-crimson)]
          group-hover:bg-[var(--color-crimson)]
          transition-colors duration-150
        "
        style={{ backgroundColor: isDark ? 'var(--color-ink)' : 'transparent' }}
      />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{isDark ? 'Eve.' : 'Morn.'}</span>
    </button>
  )
}

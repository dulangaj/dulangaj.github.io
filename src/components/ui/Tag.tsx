/* ─── Tag ────────────────────────────────────────────────────────────────── */
/* Print-notation label for tech tags, categories, etc. — [ JAVA ] style,    */
/* squared off to match the broadsheet rules. Brackets are CSS-generated so   */
/* they stay out of copied text and screen-reader output.                     */

interface TagProps {
  label: string
  variant?: 'default' | 'accent'
}

export function Tag({ label, variant = 'default' }: TagProps) {
  const base = 'tag-brackets inline-block py-0.5 text-[10px] tracking-[0.22em] uppercase font-mono'

  const styles = {
    default: 'text-[var(--color-muted)]',
    accent:  'text-[var(--color-crimson)]',
  }[variant]

  return <span className={`${base} ${styles}`}>{label}</span>
}

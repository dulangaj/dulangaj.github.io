/* ─── Tag ────────────────────────────────────────────────────────────────── */
/* Minimal pill label for tech tags, categories, etc.                        */

interface TagProps {
  label: string
  variant?: 'default' | 'accent'
}

export function Tag({ label, variant = 'default' }: TagProps) {
  const base = 'inline-block px-2.5 py-0.5 text-[11px] tracking-widest uppercase font-mono rounded-full border'

  const styles = {
    default: 'border-[var(--color-rule)] text-[var(--color-muted)] bg-transparent',
    accent:  'border-[var(--color-crimson)] text-[var(--color-crimson)] bg-transparent',
  }[variant]

  return <span className={`${base} ${styles}`}>{label}</span>
}

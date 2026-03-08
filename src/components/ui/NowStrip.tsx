import { nowConfig } from '@/data/now'

/* ─── NowStrip ───────────────────────────────────────────────────────────── */
/* Thin dateline strip between Hero and Featured.                            */
/* Keep content in src/data/now.ts so it can be updated by automation.       */

export function NowStrip() {
  if (nowConfig.items.length === 0) return null

  return (
    <aside
      aria-label="Current status"
      className="border-y border-[var(--color-rule)] bg-[var(--color-surface)]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center gap-0 overflow-x-auto">
        <span className="shrink-0 font-mono text-[10px] tracking-widest uppercase text-[var(--color-crimson)] mr-6">
          Now
        </span>
        <div className="flex items-center gap-0 divide-x divide-[var(--color-rule)]">
          {nowConfig.items.map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-5 first:pl-0">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-subtle)] shrink-0">
                {item.label}
              </span>
              <span className="font-body text-[12px] text-[var(--color-muted)] whitespace-nowrap">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

import { useEffect, useState } from 'react'
import { SiteConfig } from '@/models/SiteConfig'
import { useTheme } from '@/hooks/useTheme'

/* ─── Masthead ───────────────────────────────────────────────────────────── */
/* The newspaper nameplate. A printed banner that sits below the navigation,  */
/* dressed in triple rules, with vol/no/dateline/edition metadata.            */
/* The edition label follows the theme (light = Morning, dark = Evening) so   */
/* it always agrees with the Morn./Eve. toggle in the header.                 */

const paper = SiteConfig.paper

function formatLongDate(d: Date): string {
  return d.toLocaleDateString(paper.dateLocale, {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  })
}

function romanize(num: number): string {
  if (num <= 0) return ''
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100,  'C'], [90,  'XC'], [50,  'L'], [40,  'XL'],
    [10,   'X'], [9,   'IX'], [5,   'V'], [4,   'IV'],
    [1,    'I'],
  ]
  let result = ''
  let n = num
  for (const [val, sym] of map) {
    while (n >= val) { result += sym; n -= val }
  }
  return result
}

function volumeAndIssue(d: Date): { vol: string; no: string } {
  const year = d.getFullYear()
  const vol = romanize(year - paper.established + 1) || 'I'
  const yearStart = new Date(year, 0, 0)
  const dayOfYear = Math.floor((d.getTime() - yearStart.getTime()) / 86_400_000)
  return { vol, no: String(dayOfYear).padStart(3, '0') }
}

export function Masthead() {
  const [now, setNow] = useState(() => new Date())
  const { isDark, toggle } = useTheme()

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(tick)
  }, [])

  const { vol, no } = volumeAndIssue(now)
  const edition = isDark ? paper.editions.dark.name : paper.editions.light.name
  const editionAria = `Switch to ${isDark ? paper.editions.light.name : paper.editions.dark.name}`
  const dateline = formatLongDate(now)

  return (
    <section
      aria-label="Masthead"
      className="pt-8 pb-2 px-6 md:px-12 bg-[var(--color-paper)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top metadata strip — vol/date/edition, with a thin double rule on top */}
        <div className="border-t-4 border-double border-[var(--color-ink)] pt-3">
          {/* Letterspaced mono must never break mid-phrase: flex row on mobile
              (dateline hidden), three-column grid once the dateline appears */}
          <div className="flex items-baseline justify-between gap-3 md:grid md:grid-cols-3 font-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
            <span className="text-left whitespace-nowrap">
              Vol. {vol} &nbsp;·&nbsp; No. {no}
            </span>
            <span className="text-center hidden md:block text-[var(--color-ink)]">
              {dateline}
            </span>
            {/* The edition ear doubles as the light/dark toggle while the
                utility header is hidden at the top of the page. */}
            <button
              onClick={toggle}
              aria-label={editionAria}
              title={editionAria}
              className="text-right whitespace-nowrap font-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-[var(--color-subtle)] hover:text-[var(--color-crimson)] transition-colors duration-150 bg-transparent border-none p-0 cursor-pointer"
            >
              {edition}
            </button>
          </div>
          {/* Mobile dateline */}
          <div className="md:hidden text-center pt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink)]">
            {dateline}
          </div>
        </div>

        {/* Nameplate */}
        <div className="text-center pt-6 md:pt-8 pb-4 md:pb-5">
          <p
            aria-label="Paper nameplate"
            className="font-display font-black leading-none tracking-tight text-[var(--color-ink)] text-[clamp(2.5rem,9vw,6rem)]"
          >
            {paper.name}
          </p>
          <p className="mt-4 font-display italic text-[15px] md:text-[17px] text-[var(--color-muted)]">
            {paper.motto}
          </p>
        </div>

        {/* Bottom metadata strip — established / bureau / price, bracketed by a triple rule */}
        <div className="border-t-2 border-[var(--color-ink)]">
          <div className="border-t border-[var(--color-ink)] mt-[3px]" />
          <div className="flex items-baseline justify-between gap-3 md:grid md:grid-cols-3 pt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
            <span className="text-left whitespace-nowrap">Established {paper.established}</span>
            <span className="text-center hidden md:block">{paper.bureau}</span>
            <span className="text-right whitespace-nowrap">{paper.price}</span>
          </div>
          <div className="md:hidden text-center pt-1 font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
            {paper.bureau}
          </div>
        </div>
      </div>
    </section>
  )
}

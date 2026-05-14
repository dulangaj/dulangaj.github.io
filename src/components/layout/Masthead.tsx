import { useEffect, useState } from 'react'

/* ─── Masthead ───────────────────────────────────────────────────────────── */
/* The newspaper nameplate. A printed banner that sits below the navigation,  */
/* dressed in triple rules, with vol/no/dateline/edition metadata.            */

const PAPER_NAME = 'The Dulangan Herald'
const PAPER_MOTTO = '“All the work that’s fit to ship.”'
const ESTABLISHED = 2015
const BUREAU = 'Hong Kong Bureau'

function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  })
}

function getEditionLabel(d: Date): string {
  const hour = d.getHours()
  if (hour < 12) return 'Morning Edition'
  if (hour < 18) return 'Afternoon Edition'
  return 'Evening Edition'
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
  const vol = romanize(year - ESTABLISHED + 1) || 'I'
  const yearStart = new Date(year, 0, 0)
  const dayOfYear = Math.floor((d.getTime() - yearStart.getTime()) / 86_400_000)
  return { vol, no: String(dayOfYear).padStart(3, '0') }
}

export function Masthead() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(tick)
  }, [])

  const { vol, no } = volumeAndIssue(now)
  const edition = getEditionLabel(now)
  const dateline = formatLongDate(now)
  const price = '$0.00 · By the Public'

  return (
    <section
      aria-label="Masthead"
      className="pt-20 md:pt-24 pb-2 px-6 md:px-12 bg-[var(--color-paper)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top metadata strip — vol/date/edition, with a thin double rule on top */}
        <div className="border-t-4 border-double border-[var(--color-ink)] pt-3">
          <div className="grid grid-cols-3 items-baseline gap-3 font-mono text-[10px] md:text-[11px] tracking-widest uppercase text-[var(--color-subtle)]">
            <span className="text-left">
              Vol. {vol} &nbsp;·&nbsp; No. {no}
            </span>
            <span className="text-center hidden md:block text-[var(--color-ink)]">
              {dateline}
            </span>
            <span className="text-right">{edition}</span>
          </div>
          {/* Mobile dateline */}
          <div className="md:hidden text-center pt-2 font-mono text-[10px] tracking-widest uppercase text-[var(--color-ink)]">
            {dateline}
          </div>
        </div>

        {/* Nameplate */}
        <div className="text-center pt-6 md:pt-8 pb-4 md:pb-5">
          <p
            aria-label="Paper nameplate"
            className="font-display font-black leading-none tracking-tight text-[var(--color-ink)] text-[clamp(2.5rem,9vw,6rem)]"
          >
            {PAPER_NAME}
          </p>
          <p className="mt-4 font-display italic text-[15px] md:text-[17px] text-[var(--color-muted)]">
            {PAPER_MOTTO}
          </p>
        </div>

        {/* Bottom metadata strip — established / bureau / price, bracketed by a triple rule */}
        <div className="border-t-2 border-[var(--color-ink)]">
          <div className="border-t border-[var(--color-ink)] mt-[3px]" />
          <div className="grid grid-cols-3 items-baseline gap-3 pt-3 font-mono text-[10px] tracking-widest uppercase text-[var(--color-subtle)]">
            <span className="text-left">Established {ESTABLISHED}</span>
            <span className="text-center hidden md:block">{BUREAU}</span>
            <span className="text-right">{price}</span>
          </div>
          <div className="md:hidden text-center pt-1 font-mono text-[10px] tracking-widest uppercase text-[var(--color-subtle)]">
            {BUREAU}
          </div>
        </div>
      </div>
    </section>
  )
}

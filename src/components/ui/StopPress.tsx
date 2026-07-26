import { useEffect, useRef } from 'react'
import { type NowItem } from '@/data/now'
import { useLiveBulletins } from '@/hooks/useLiveBulletins'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── StopPress ──────────────────────────────────────────────────────────── */
/* The slim newspaper bulletin strip that runs across the top of the page.    */
/* Bulletins tick past like wire copy. Motion is driven by advancing the      */
/* viewport's scrollLeft (not a CSS transform), so the strip is also a real   */
/* scroll area: the reader can flick ahead or back at will. A hovering mouse  */
/* or a finger held on the strip pauses the wire. Under prefers-reduced-      */
/* motion the script never starts and the strip collapses to a single static, */
/* hand-scrollable run (globals.css).                                         */
/* Items start from the build-time fallback and are quietly replaced by the   */
/* live wire feeds (useLiveBulletins).                                        */

const stopPress = SiteConfig.paper.stopPress

/* The track holds three identical runs; the scroll position wraps by exactly
   one run width, which is invisible because the runs are identical. Three
   runs (not two) keep headroom on both sides so the reader can scroll ahead
   or back without hitting an edge. Only the first run is exposed to
   assistive tech. */
const REPEAT_RUNS = [false, true, true]

function BulletinRun({ items, hidden }: { items: NowItem[]; hidden: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="stop-press-run flex items-baseline whitespace-nowrap">
      {items.map((item) => (
        <span key={item.label} className="flex items-baseline">
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-subtle)] mr-2">
            {item.label}
          </span>
          <span className="font-serif text-[13px] text-[var(--color-ink)]">
            {item.value}
          </span>
          {/* Trailing dagger on every item so the junction between runs
              reads as one continuous wire */}
          <span aria-hidden="true" className="mx-4 font-serif text-[13px] text-[var(--color-crimson)]">
            {stopPress.separator}
          </span>
        </span>
      ))}
    </div>
  )
}

export function StopPress() {
  const items = useLiveBulletins()
  const viewportRef = useRef<HTMLDivElement>(null)

  /* Auto-advance by mutating scrollLeft each frame. The reader's own
     scrolling is folded into the position (diff against the last value we
     set), so flicking the bar fast-forwards or rewinds the wire; the pace
     resumes from wherever they let go. Position is kept a full run away
     from either edge by wrapping ±1 run width. */
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let last = performance.now()
    let pos = 0
    let lastSet = -1

    /* Two independent reasons to hold the wire: a mouse resting on the strip,
       and a finger pressing it. They are tracked apart because touch is the
       unreliable one — a touch that turns into a page scroll is taken away by
       the browser as `pointercancel`, and the matching `pointerleave` may
       never arrive. Hover is therefore only ever set by a mouse (the strip
       sits at the top of the page, so on a phone the first downward swipe
       drags a finger straight across it), and the release of a press is
       listened for on the window so a finger lifted off the strip still
       counts. */
    let hovered = false
    let pressed = false
    const isPaused = () => hovered || pressed

    const onEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') hovered = true }
    const onLeave = (e: PointerEvent) => { if (e.pointerType === 'mouse') hovered = false }
    const onDown = () => { pressed = true }
    const onRelease = () => { pressed = false }

    viewport.addEventListener('pointerenter', onEnter)
    viewport.addEventListener('pointerleave', onLeave)
    viewport.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onRelease)
    window.addEventListener('pointercancel', onRelease)

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      /* Cap dt so a backgrounded tab doesn't leap on return */
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const runWidth = viewport.scrollWidth / REPEAT_RUNS.length
      if (runWidth <= 0) return
      if (lastSet < 0) {
        /* Start one run in so there is headroom to scroll backwards too */
        pos = runWidth
      } else {
        pos += viewport.scrollLeft - lastSet
        if (!isPaused()) pos += (runWidth / stopPress.loopSeconds) * dt
      }
      if (pos >= runWidth * 1.5) pos -= runWidth
      else if (pos < runWidth * 0.5) pos += runWidth
      viewport.scrollLeft = pos
      lastSet = viewport.scrollLeft
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      viewport.removeEventListener('pointerenter', onEnter)
      viewport.removeEventListener('pointerleave', onLeave)
      viewport.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onRelease)
      window.removeEventListener('pointercancel', onRelease)
    }
  }, [])

  if (items.length === 0) return null

  return (
    <aside
      aria-label={stopPress.ariaLabel}
      className="border-y border-[var(--color-ink)] bg-[var(--color-paper)]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-2 flex items-center">
        <span
          className="
            shrink-0 mr-5 px-2 py-1
            font-mono text-[10px] tracking-[0.28em] uppercase
            text-[var(--color-paper)] bg-[var(--color-crimson)]
          "
        >
          {stopPress.label}
        </span>

        <div
          ref={viewportRef}
          className="stop-press-viewport relative flex-1 overflow-x-auto no-scrollbar overscroll-x-contain"
        >
          {/* Edge fades — copy slips in and out of the margins, not clipped mid-stroke */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8"
            style={{ background: 'linear-gradient(to right, var(--color-paper), transparent)' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8"
            style={{ background: 'linear-gradient(to left, var(--color-paper), transparent)' }}
          />
          <div className="stop-press-track flex items-baseline w-max">
            {REPEAT_RUNS.map((hidden, idx) => (
              <BulletinRun key={idx} items={items} hidden={hidden} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

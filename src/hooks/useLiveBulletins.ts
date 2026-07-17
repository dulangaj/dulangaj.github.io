import { useEffect, useState } from 'react'
import { nowConfig, type NowItem } from '@/data/now'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── useLiveBulletins ───────────────────────────────────────────────────── */
/* Live wire copy for the Stop Press strip. The prerendered fallback comes    */
/* from src/data/now.ts; after mount, each feed in SiteConfig.paper.stopPress */
/* .feeds (gist raw URLs) is fetched once. A feed must carry an `updated`     */
/* ISO-8601 stamp; if the stamp is missing, unparseable, or older than the    */
/* feed's maxAgeHours, the whole feed is discarded — a silent publisher must  */
/* not leave stale copy on the front page. Fresh feeds merge by label: a live */
/* item replaces the fallback bulletin with the same label, new labels append */
/* at the end. Any failure — network, bad JSON, wrong shape — leaves the      */
/* fallback in place; the paper never shows an error state.                   */

const MAX_ITEMS = 12
const MAX_VALUE_LENGTH = 200

function isFresh(raw: object, maxAgeHours: number): boolean {
  const updated = Date.parse(String((raw as { updated?: unknown }).updated ?? ''))
  if (Number.isNaN(updated)) return false
  return Date.now() - updated <= maxAgeHours * 3_600_000
}

function sanitize(raw: unknown, maxAgeHours: number): NowItem[] {
  if (typeof raw !== 'object' || raw === null) return []
  if (!isFresh(raw, maxAgeHours)) return []
  const items = (raw as { items?: unknown }).items
  if (!Array.isArray(items)) return []
  return items
    .filter(
      (item): item is NowItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as NowItem).label === 'string' &&
        typeof (item as NowItem).value === 'string',
    )
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim().slice(0, MAX_VALUE_LENGTH),
    }))
    .filter((item) => item.label.length > 0 && item.value.length > 0)
}

function mergeByLabel(base: NowItem[], incoming: NowItem[]): NowItem[] {
  const merged = [...base]
  for (const item of incoming) {
    const idx = merged.findIndex(
      (existing) => existing.label.toLowerCase() === item.label.toLowerCase(),
    )
    if (idx >= 0) merged[idx] = item
    else merged.push(item)
  }
  return merged.slice(0, MAX_ITEMS)
}

export function useLiveBulletins(): NowItem[] {
  const [items, setItems] = useState<NowItem[]>(nowConfig.items)

  useEffect(() => {
    const { feedBase, feeds } = SiteConfig.paper.stopPress
    if (feeds.length === 0) return

    let cancelled = false
    Promise.all(
      feeds.map(async ({ file, maxAgeHours }) => {
        try {
          const res = await fetch(`${feedBase}/${file}`, { cache: 'no-store' })
          if (!res.ok) return []
          return sanitize(await res.json(), maxAgeHours)
        } catch {
          return []
        }
      }),
    ).then((lists) => {
      const incoming = lists.flat()
      if (!cancelled && incoming.length > 0) {
        setItems(mergeByLabel(nowConfig.items, incoming))
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return items
}

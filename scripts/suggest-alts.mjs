#!/usr/bin/env node
/**
 * suggest-alts.mjs
 *
 * Prints a suggested `alt` text for each map-eligible photo in
 * src/data/photoMetadata.ts. Format:
 *
 *   "Dulanga Jayawardena at <location>, <Month YYYY>"
 *
 * Output is meant for human review — copy the good ones into photoMetadata.ts,
 * rewrite the awkward ones by hand. Does not modify any files.
 *
 * Usage: node scripts/suggest-alts.mjs
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const NAME = 'Dulanga Jayawardena'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Extract `YYYY-MM` from a metadata `date` field or a `YY.MM_…` filename. */
function monthYear(filename, dateField) {
  if (dateField && /^\d{4}-\d{2}/.test(dateField)) {
    const [y, m] = dateField.split('-')
    return { year: y, month: MONTHS[Number(m) - 1] }
  }
  const m = filename.match(/^(\d{2})\.(\d{2})_/)
  if (m) return { year: `20${m[1]}`, month: MONTHS[Number(m[2]) - 1] }
  const yearOnly = filename.match(/^(\d{2})_/)
  if (yearOnly) return { year: `20${yearOnly[1]}`, month: null }
  return { year: null, month: null }
}

/** Strip ", Country" / ", Region" tail to get a tighter place name. */
function tightenLocation(location) {
  if (!location) return null
  // "Torres del Paine National Park, Chile" → "Torres del Paine National Park"
  // "Hanover, NH, USA" → "Hanover"
  return location.split(',')[0].trim()
}

function suggestAlt({ filename, metadata }) {
  const place = tightenLocation(metadata.location) ?? metadata.subtitle ?? null
  const { month, year } = monthYear(filename, metadata.date)

  const datePart =
    month && year ? `${month} ${year}`
      : year ? year
        : null

  if (place && datePart) return `${NAME} at ${place}, ${datePart}`
  if (place) return `${NAME} at ${place}`
  if (datePart) return `${NAME}, ${datePart}`
  return `${NAME}`
}

/** Crude TS-object parser: pulls the keys + a few string fields per entry.
 *  Works because photoMetadata.ts is a flat literal with predictable shape. */
function parsePhotoMetadata(source) {
  const entries = []
  // Match: '<filename>': { ... },
  const re = /'([^']+)':\s*\{([\s\S]*?)\n\s*\},/g
  let m
  while ((m = re.exec(source)) !== null) {
    const filename = m[1]
    const body = m[2]
    const get = (key) => {
      const r = new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`)
      const x = body.match(r)
      return x ? x[1].replace(/\\'/g, "'") : undefined
    }
    const has = (key) => new RegExp(`\\b${key}:\\s*true\\b`).test(body)
    entries.push({
      filename,
      metadata: {
        title: get('title'),
        subtitle: get('subtitle'),
        location: get('location'),
        date: get('date'),
        alt: get('alt'),
        excludeFromMap: has('excludeFromMap'),
      },
    })
  }
  return entries
}

const source = readFileSync(resolve(repoRoot, 'src/data/photoMetadata.ts'), 'utf8')
const entries = parsePhotoMetadata(source)

const eligible = entries.filter((e) => !e.metadata.excludeFromMap)
const colWidth = Math.max(...eligible.map((e) => e.filename.length)) + 2

console.log(`# Suggested alt text — ${eligible.length} map-eligible photos\n`)
console.log('# Format: "Dulanga Jayawardena at <place>, <Month Year>"')
console.log('# Edit anything that reads awkwardly. Then I will write these into photoMetadata.ts.\n')

for (const entry of eligible) {
  const suggestion = suggestAlt(entry)
  const marker = entry.metadata.alt ? '✓' : ' '
  console.log(`${marker} ${entry.filename.padEnd(colWidth)}→ ${suggestion}`)
  if (entry.metadata.alt && entry.metadata.alt !== suggestion) {
    console.log(`  ${''.padEnd(colWidth)}  (current: ${entry.metadata.alt})`)
  }
}

const excluded = entries.filter((e) => e.metadata.excludeFromMap)
if (excluded.length > 0) {
  console.log(`\n# ${excluded.length} excluded from map (skipped):`)
  for (const e of excluded) console.log(`  ${e.filename}`)
}

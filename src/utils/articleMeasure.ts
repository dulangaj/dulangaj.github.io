/* ─── Article measure ────────────────────────────────────────────────────── */
/* Source offsets and heading list the inside-pages treatment renders from. */

/* Fenced code blanked out, character for character, so offsets stay true. */
function maskFences(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, (fence) => fence.replace(/[^\n]/g, ' '))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractHeadings(markdown: string): string[] {
  return [...maskFences(markdown).matchAll(/^\s{0,3}##\s+(.+?)\s*#*\s*$/gm)]
    .map((match) => match[1].replace(/[*_`]/g, ''))
}

/* Source offset of the block that becomes the article's first <p> — the one
   that carries the dateline and the drop cap. Null when there is none. */
export function ledeOffset(markdown: string): number | null {
  const masked = maskFences(markdown)
  let cursor = 0
  for (const block of masked.split(/\n\s*\n/)) {
    const start = masked.indexOf(block, cursor)
    cursor = start + block.length
    const trimmed = block.trim()
    if (!trimmed) continue
    if (/^(#{1,6}\s|>|!\[|\||[-+*]\s|\d+\.\s)/.test(trimmed)) continue
    if (/^([-*_])(?:\s*\1){2,}$/.test(trimmed)) continue
    return masked.indexOf(trimmed[0], start)
  }
  return null
}

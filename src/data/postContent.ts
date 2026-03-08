/* ─── Post Content Loader ────────────────────────────────────────────────── */
/* Loads all posts/*.md files at build time via Vite glob import.             */
/* Parses frontmatter for metadata and exports auto-loaded Post objects.       */

import { Post } from '@/models/Post'

const rawFiles = import.meta.glob('../../posts/*.md', {
  query:  '?raw',
  import: 'default',
  eager:  true,
}) as Record<string, string>

/* ── Minimal frontmatter parser (handles our YAML subset) ───────────────── */

type FMValue = string | string[] | number

function parseFrontmatter(raw: string): Record<string, FMValue> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const result: Record<string, FMValue> = {}
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([\w_]+):\s*(.+)$/)
    if (!m) continue
    const [, key, val] = m
    const trimmed = val.trim()
    if (trimmed.startsWith('[')) {
      result[key] = trimmed
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    } else if (/^\d+$/.test(trimmed)) {
      result[key] = parseInt(trimmed, 10)
    } else {
      result[key] = trimmed.replace(/^["']|["']$/g, '')
    }
  }
  return result
}

function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\r?\n/, '').trim()
}

/* ── Auto-extract first prose paragraph as excerpt ──────────────────────── */

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\\([\\`*{}\[\]()#+\-.!_>~|])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function isExcerptCandidate(paragraph: string): boolean {
  const trimmed = paragraph.trim()

  if (!trimmed || trimmed.length <= 20) return false
  if (/^#{1,6}\s/.test(trimmed)) return false
  if (/^([-*_])(?:\s*\1){2,}\s*$/.test(trimmed)) return false
  if (/^[>*|]/.test(trimmed)) return false
  if (/^!\[/.test(trimmed)) return false
  if (/^(?:[-+*]\s|\d+\.\s)/.test(trimmed)) return false

  return true
}

function extractExcerpt(body: string, maxLen = 200): string {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())

  for (const paragraph of paragraphs) {
    if (!isExcerptCandidate(paragraph)) continue

    const plainText = stripInlineMarkdown(paragraph)
    if (!plainText) continue

    return plainText.length > maxLen ? plainText.slice(0, maxLen).trimEnd() + '…' : plainText
  }

  return ''
}

/* ── Build all posts from filesystem ────────────────────────────────────── */

export function getAllPosts(): Post[] {
  const result: Post[] = []

  for (const [path, raw] of Object.entries(rawFiles)) {
    const stem = path.split('/').pop()!.replace(/\.md$/, '')
    const dateMatch = stem.match(/^(\d{4}-\d{2}-\d{2})/)
    if (!dateMatch) continue

    const date = dateMatch[1]
    const fm   = parseFrontmatter(raw)
    const body = stripFrontmatter(raw)

    const imageFile = typeof fm.image === 'string' ? fm.image : undefined

    result.push(new Post({
      id:       stem,
      title:    typeof fm.title    === 'string' ? fm.title    : stem,
      excerpt:  extractExcerpt(body),
      date,
      category: typeof fm.category === 'string' ? fm.category : 'Uncategorized',
      subtitle: typeof fm.subtitle === 'string' ? fm.subtitle : undefined,
      image:    imageFile ? `/assets/img/${imageFile}` : undefined,
      readTime: typeof fm.read_time === 'number' ? fm.read_time : undefined,
      link:     typeof fm.link     === 'string' ? fm.link     : undefined,
      tags:     Array.isArray(fm.tags) ? fm.tags as string[] : [],
      file:     stem,
    }))
  }

  return result.sort((a, b) => b.date.localeCompare(a.date))
}

/* ── Content map for markdown body loading ──────────────────────────────── */

const contentMap: Record<string, string> = {}

for (const [path, raw] of Object.entries(rawFiles)) {
  const stem = path.split('/').pop()!.replace(/\.md$/, '')
  contentMap[stem] = stripFrontmatter(raw)
}

export function getPostContent(file: string): string | null {
  return contentMap[file] ?? null
}

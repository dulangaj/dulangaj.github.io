/* ─── Post Content Loader ────────────────────────────────────────────────── */
/* Loads all _posts/*.md files at build time via Vite glob import.            */
/* Returns a map from filename stem → markdown body (frontmatter stripped).  */

const rawFiles = import.meta.glob('../../_posts/*.md', {
  query:  '?raw',
  import: 'default',
  eager:  true,
}) as Record<string, string>

function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\r?\n/, '').trim()
}

const contentMap: Record<string, string> = {}

for (const [path, raw] of Object.entries(rawFiles)) {
  // path is like '../../_posts/2025-05-01-morgan-stanley-equity-risk.md'
  const stem = path.split('/').pop()!.replace(/\.md$/, '')
  contentMap[stem] = stripFrontmatter(raw)
}

export function getPostContent(file: string): string | null {
  return contentMap[file] ?? null
}

import { Post } from '@/models/Post'
import { getAllPosts } from '@/data/postContent'
import { featuredConfig } from '@/data/featuredConfig'

/* ─── Posts ──────────────────────────────────────────────────────────────── */
/* Auto-loaded from posts/*.md frontmatter. Sorted most-recent first.         */
/* Drop a new .md file in posts/ and it appears here automatically.           */

export const posts = getAllPosts()

/* ─── Featured Posts ─────────────────────────────────────────────────────── */
/* Ordered as listed in featuredConfig. Each merges auto-loaded post data     */
/* with the curated excerpt (and optional image override) from the config.    */

export const featuredPosts: Post[] = featuredConfig
  .map((cfg) => {
    const base = posts.find((p) => p.id === cfg.id)
    if (!base) return null
    return new Post({
      id:       base.id,
      title:    base.title,
      excerpt:  cfg.excerpt,
      date:     base.date,
      category: base.category,
      subtitle: base.subtitle,
      image:    cfg.image ?? base.image,
      readTime: base.readTime,
      link:     base.link,
      tags:     base.tags,
      file:     base.file,
      featured: true,
    })
  })
  .filter(Boolean) as Post[]

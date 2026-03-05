import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi'
import { posts } from '@/data/posts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Tag } from '@/components/ui/Tag'

/* ─── PostDetail ──────────────────────────────────────────────────────────── */
/* Full article page. Accessed via /post/:id from both Projects and Writing.   */

export function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const post = posts.find((p) => p.id === id)

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)] mb-4">404</p>
            <h1 className="font-display text-4xl text-[var(--color-ink)] mb-6">Post not found.</h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-[12px] tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200"
            >
              <FiArrowLeft size={12} /> Back to portfolio
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="pt-24 pb-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200"
            >
              <FiArrowLeft size={11} /> Back to portfolio
            </Link>
          </motion.div>

          {/* Dateline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--color-rule)]"
          >
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)]">
              {post.category}
            </span>
            {post.subtitle && (
              <>
                <div className="h-px w-6 bg-[var(--color-rule)]" />
                <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-subtle)]">
                  {post.subtitle}
                </span>
              </>
            )}
            <div className="h-px w-6 bg-[var(--color-rule)]" />
            <span className="font-mono text-[11px] tracking-widest text-[var(--color-subtle)]">
              {post.formattedDate}
            </span>
            {post.readTime && (
              <>
                <div className="h-px w-6 bg-[var(--color-rule)]" />
                <span className="font-mono text-[11px] tracking-widest text-[var(--color-subtle)]">
                  {post.readTime} min read
                </span>
              </>
            )}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] text-[var(--color-ink)] mb-8"
          >
            {post.title}
          </motion.h1>

          {/* Full-bleed image */}
          {post.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-lg aspect-[16/9] bg-[var(--color-rule)] mb-12"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Body — excerpt as article lead */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-[17px] leading-[1.85] text-[var(--color-ink)] mb-10 border-l-2 border-[var(--color-crimson)] pl-6"
          >
            {post.excerpt}
          </motion.p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {post.tags.map((tag) => <Tag key={tag} label={tag} />)}
            </motion.div>
          )}

          {/* External link CTA */}
          {post.link && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="border-t border-[var(--color-rule)] pt-8"
            >
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-mono text-[13px] tracking-wide text-[var(--color-crimson)] hover:gap-4 transition-all duration-200"
              >
                View the full project <FiExternalLink size={13} />
              </a>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}

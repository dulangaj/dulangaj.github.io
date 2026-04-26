import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { posts } from '@/data/posts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getPostPath } from '@/utils/postUrls'

/* ─── WritingPage ─────────────────────────────────────────────────────────── */
/* Crawlable archive of every article. Mirrors /writing/ static SEO entry.    */

export function WritingPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />

      <main id="main-content" className="pt-24 pb-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)] mb-4">
              Writing archive
            </p>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] text-[var(--color-ink)] mb-6">
              Articles, project notes, and field notes.
            </h1>
            <p className="font-body text-[15px] leading-[1.8] text-[var(--color-muted)] max-w-2xl">
              A complete index of long-form writing on the site. One permanent URL per article.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-6 list-none p-0"
          >
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  to={getPostPath(post.id)}
                  className="group block p-6 md:p-8 rounded-lg border border-[var(--color-rule)] hover:border-[var(--color-crimson)] transition-colors duration-300 bg-[var(--color-surface)]"
                >
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)]">
                      {post.category}
                    </span>
                    <div className="h-px w-4 bg-[var(--color-rule)]" />
                    <span className="font-mono text-[11px] tracking-widest text-[var(--color-subtle)]">
                      {post.formattedDate}
                    </span>
                    {post.readTime && (
                      <>
                        <div className="h-px w-4 bg-[var(--color-rule)]" />
                        <span className="font-mono text-[11px] tracking-widest text-[var(--color-subtle)]">
                          {post.readTime} min read
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="font-display text-[1.5rem] leading-snug text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-crimson)] transition-colors duration-200">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="font-body text-[14px] leading-[1.7] text-[var(--color-muted)] mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--color-crimson)] group-hover:gap-2.5 transition-all duration-200">
                    Read <FiArrowRight size={12} />
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </main>

      <Footer />
    </>
  )
}

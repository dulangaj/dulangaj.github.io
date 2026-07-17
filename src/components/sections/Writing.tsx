import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiChevronDown } from 'react-icons/fi'
import { posts } from '@/data/posts'
import { Post } from '@/models/Post'
import { SiteConfig } from '@/models/SiteConfig'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionBanner } from '@/components/ui/SectionBanner'
import { getPostPath } from '@/utils/postUrls'

const VISIBLE_INITIAL = 5

const writingSection = SiteConfig.paper.sections.find((s) => s.id === 'writing')!
const cta = SiteConfig.paper.cta

/* ─── Writing ────────────────────────────────────────────────────────────── */
/* Editorial rhythmic grid: every 3rd card (0, 3, 6…) spans full width,      */
/* the rest fill two equal columns — the pattern used by The Atlantic, Wired. */

interface PostCardProps {
  post: Post
  featured?: boolean
  delay?: number
}

function PostCard({ post, featured = false, delay = 0 }: PostCardProps) {
  const href = getPostPath(post.id)

  if (featured) {
    return (
      <a href={href} className="block">
      <FadeIn delay={delay} className="group cursor-pointer">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 border-t border-[var(--color-rule)] pt-6">
          {/* Image */}
          {post.image && (
            <div className="relative overflow-hidden aspect-[16/9] md:aspect-auto md:min-h-[300px] bg-[var(--color-rule)]">
              <motion.img
                src={post.image}
                alt={post.title}
                className="story-image w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-crimson)]">
                {post.category}
              </span>
              {post.readTime && (
                <>
                  <div className="h-px w-4 bg-[var(--color-rule)]" />
                  <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-subtle)]">
                    {post.formattedReadTime}
                  </span>
                </>
              )}
            </div>

            <h3 className="font-display text-balance text-[1.6rem] leading-tight text-[var(--color-ink)] mb-4 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="font-serif text-[13px] leading-relaxed text-[var(--color-muted)] mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-subtle)]">
                {post.formattedDate}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-crimson)] group-hover:gap-2.5 transition-all duration-200">
                {cta.read} <FiArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </FadeIn>
      </a>
    )
  }

  return (
    <a href={href} className="block h-full">
    <FadeIn delay={delay} className="group cursor-pointer h-full">
      <div className="h-full flex flex-col border-t border-[var(--color-rule)] pt-6">
        {/* Image */}
        {post.image && (
          <div className="relative overflow-hidden aspect-[16/9] bg-[var(--color-rule)]">
            <motion.img
              src={post.image}
              alt={post.title}
              className="story-image w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-crimson)]">
              {post.category}
            </span>
            {post.readTime && (
              <>
                <div className="h-px w-3 bg-[var(--color-rule)]" />
                <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-subtle)]">
                  {post.formattedReadTime}
                </span>
              </>
            )}
          </div>

          <h3 className="font-display text-balance text-[1.1rem] leading-snug text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-crimson)] transition-colors duration-300 flex-1">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="font-serif text-[12px] leading-relaxed text-[var(--color-muted)] mb-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-subtle)]">
            {post.formattedDate}
          </span>
        </div>
      </div>
    </FadeIn>
    </a>
  )
}

export function Writing() {
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? posts : posts.slice(0, VISIBLE_INITIAL)
  const hasMore = posts.length > VISIBLE_INITIAL

  return (
    <section id="writing" className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <SectionBanner
              folio={writingSection.folio}
              label={writingSection.label}
              note={writingSection.note}
              bottomRule="single"
            />
          </div>
          <h2 className="font-display text-balance text-[clamp(2rem,5vw,3.5rem)] text-[var(--color-ink)] mb-4 leading-tight">
            {writingSection.headline}
          </h2>
          <p className="font-serif text-[15px] text-[var(--color-muted)] mb-10 md:mb-16 max-w-xl">
            {writingSection.standfirst}
          </p>
        </FadeIn>

        {/* Paired rows share a hairline column rule in the gutter at md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-0">
          <AnimatePresence initial={false}>
            {visible.map((post, i) => {
              const isFeatured = i % 3 === 0
              const columnClass =
                isFeatured ? 'md:col-span-2'
                  : i % 3 === 1 ? 'h-full md:pr-8'
                    : 'h-full md:pl-8 md:border-l md:border-[var(--color-rule)]'
              return (
                <motion.div
                  key={post.id}
                  className={columnClass}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                >
                  <PostCard post={post} featured={isFeatured} delay={0} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Show more / show less */}
        {hasMore && (
          <FadeIn className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200 cursor-pointer bg-transparent border-none"
            >
              {showAll ? cta.showLess : `${cta.showAll} ${posts.length}`}
              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown size={13} />
              </motion.span>
            </button>
          </FadeIn>
        )}
      </div>
    </section>
  )
}

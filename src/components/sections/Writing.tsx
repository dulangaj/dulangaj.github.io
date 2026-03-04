import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { posts } from '@/data/posts'
import { Post } from '@/models/Post'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'

/* ─── Writing ────────────────────────────────────────────────────────────── */
/* Editorial grid of blog post cards — featured large card + row of smaller. */

interface PostCardProps {
  post: Post
  featured?: boolean
  delay?: number
}

function PostCard({ post, featured = false, delay = 0 }: PostCardProps) {
  if (featured) {
    return (
      <FadeIn delay={delay} className="group cursor-pointer md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-lg border border-[var(--color-rule)] hover:border-[var(--color-crimson)] transition-colors duration-500">
          {/* Image */}
          {post.image && (
            <div className="relative overflow-hidden aspect-[16/9] md:aspect-auto bg-[var(--color-rule)]" style={{ minHeight: '300px' }}>
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-center p-8 md:p-12 bg-[var(--color-surface)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)]">
                {post.category}
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

            <h3 className="font-display text-[1.6rem] leading-tight text-[var(--color-ink)] mb-4 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
              {post.title}
            </h3>

            <p className="font-body text-[13px] leading-relaxed text-[var(--color-muted)] mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-wide text-[var(--color-subtle)]">
                {post.formattedDate}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--color-crimson)] group-hover:gap-2.5 transition-all duration-200">
                Read <FiArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </FadeIn>
    )
  }

  return (
    <FadeIn delay={delay} className="group cursor-pointer">
      <div className="h-full flex flex-col overflow-hidden rounded-lg border border-[var(--color-rule)] hover:border-[var(--color-crimson)] transition-colors duration-500 bg-[var(--color-surface)]">
        {/* Image */}
        {post.image && (
          <div className="relative overflow-hidden aspect-[16/9] bg-[var(--color-rule)]">
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-crimson)]">
              {post.category}
            </span>
            {post.readTime && (
              <>
                <div className="h-px w-3 bg-[var(--color-rule)]" />
                <span className="font-mono text-[10px] tracking-widest text-[var(--color-subtle)]">
                  {post.readTime} min
                </span>
              </>
            )}
          </div>

          <h3 className="font-display text-[1.1rem] leading-snug text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-crimson)] transition-colors duration-300 flex-1">
            {post.title}
          </h3>

          <p className="font-body text-[12px] leading-relaxed text-[var(--color-muted)] mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <span className="font-mono text-[10px] tracking-wide text-[var(--color-subtle)]">
            {post.formattedDate}
          </span>
        </div>
      </div>
    </FadeIn>
  )
}

export function Writing() {
  const [featured, ...rest] = posts

  return (
    <section id="writing" className="px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionLabel text="Writing" index="03" />
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[var(--color-ink)] mb-4 leading-tight">
            Notes from the field.
          </h2>
          <p className="font-body text-[15px] text-[var(--color-muted)] mb-16 max-w-xl">
            Engineering war-stories, research summaries, and reflections on building things.
          </p>
        </FadeIn>

        {/* Grid: featured full-width, then 3-column row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PostCard post={featured} featured delay={0} />
          {rest.map((post, i) => (
            <PostCard key={post.id} post={post} delay={0.1 + 0.08 * i} />
          ))}
        </div>
      </div>
    </section>
  )
}

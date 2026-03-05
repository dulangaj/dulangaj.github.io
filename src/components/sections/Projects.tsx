import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { featuredPosts } from '@/data/posts'
import { Post } from '@/models/Post'
import { FadeIn } from '@/components/ui/FadeIn'

/* ─── Projects / Front Page ───────────────────────────────────────────────── */
/* Newspaper front page: one dominant lead story, secondary column headlines.  */
/* Teases only — the Writing section below is "inside the paper."              */

function LeadStory({ post }: { post: Post }) {
  return (
    <FadeIn>
      <Link
        to={`/post/${post.id}`}
        className="group grid grid-cols-1 md:grid-cols-5 border-b border-[var(--color-rule)] cursor-pointer"
      >
        {/* Text column — left 3/5 */}
        <div className="md:col-span-3 flex flex-col justify-center py-10 md:py-16 md:pr-12">
          {/* Category + byline */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)]">
              {post.category}
            </span>
            <div className="h-px w-8 bg-[var(--color-rule)]" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-subtle)]">
              {post.subtitle}
            </span>
            <div className="h-px w-8 bg-[var(--color-rule)]" />
            <span className="font-mono text-[11px] tracking-widest text-[var(--color-subtle)]">
              {post.year}
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] text-[var(--color-ink)] mb-6 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
            {post.title}
          </h2>

          {/* Standfirst — one sentence only */}
          <p className="font-body text-[15px] leading-relaxed text-[var(--color-muted)] mb-8 max-w-prose line-clamp-2">
            {post.excerpt}
          </p>

          {/* Read more */}
          <span className="inline-flex items-center gap-2 font-mono text-[12px] tracking-widest uppercase text-[var(--color-crimson)] group-hover:gap-3 transition-all duration-200">
            Read more <FiArrowRight size={12} />
          </span>
        </div>

        {/* Image — right 2/5, full bleed */}
        {post.image && (
          <div className="md:col-span-2 relative overflow-hidden aspect-[4/3] md:aspect-auto bg-[var(--color-rule)]" style={{ minHeight: '320px' }}>
            <motion.img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
            <div className="absolute inset-0 bg-[var(--color-crimson)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          </div>
        )}
      </Link>
    </FadeIn>
  )
}

function SecondaryStory({ post, index }: { post: Post; index: number }) {
  return (
    <FadeIn delay={0.05 * index}>
      <Link
        to={`/post/${post.id}`}
        className="group flex flex-col pt-5 cursor-pointer border-t border-[var(--color-rule)]"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-crimson)] mb-3">
          {post.category}
        </span>

        <h3 className="font-display text-[1.1rem] leading-snug text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
          {post.title}
        </h3>

        <p className="font-body text-[12px] leading-relaxed text-[var(--color-muted)] flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-4 pt-4 border-t border-[var(--color-rule)] flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-widest text-[var(--color-subtle)]">
            {post.subtitle ? `${post.subtitle} · ` : ''}{post.year}
          </span>
          <FiArrowRight size={11} className="text-[var(--color-rule)] group-hover:text-[var(--color-crimson)] transition-colors duration-200" />
        </div>
      </Link>
    </FadeIn>
  )
}

export function Projects() {
  const [lead, ...secondaries] = featuredPosts
  const secondaryGridClass =
    secondaries.length === 1 ? 'sm:grid-cols-1 md:grid-cols-1'
      : secondaries.length === 2 ? 'sm:grid-cols-2 md:grid-cols-2'
        : secondaries.length === 3 ? 'sm:grid-cols-2 md:grid-cols-3'
          : 'sm:grid-cols-2 md:grid-cols-4'

  return (
    <section id="projects" className="px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">

        {/* Masthead */}
        <FadeIn>
          <div className="flex items-baseline justify-between border-b-2 border-[var(--color-ink)] pb-3 mb-0">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-subtle)]">01</span>
              <span className="font-display text-[1.1rem] tracking-wide text-[var(--color-ink)]">Selected Work</span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[var(--color-subtle)] hidden sm:block">
              Vol. I · Est. 2015
            </span>
          </div>
        </FadeIn>

        {/* Lead story */}
        <LeadStory post={lead} />

        {/* Secondary columns */}
        {secondaries.length > 0 && (
          <div className={`grid grid-cols-1 ${secondaryGridClass} gap-8 pt-8`}>
            {secondaries.map((post, i) => (
              <SecondaryStory key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

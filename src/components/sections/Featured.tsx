import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { featuredPosts } from '@/data/posts'
import { Post } from '@/models/Post'
import { SiteConfig } from '@/models/SiteConfig'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionBanner } from '@/components/ui/SectionBanner'
import { getPostPath } from '@/utils/postUrls'

const frontPage = SiteConfig.paper.sections.find((s) => s.id === 'featured')!

/* ─── Featured / Front Page ───────────────────────────────────────────────── */
/* Newspaper front page: one dominant lead story, secondary column headlines.  */
/* Teases only — the Writing section below is "inside the paper."              */

function LeadStory({ post }: { post: Post }) {
  return (
    <FadeIn>
      <a
        href={getPostPath(post.id)}
        className="group grid grid-cols-1 md:grid-cols-5 border-b border-[var(--color-rule)] cursor-pointer min-w-0"
      >
        {/* Text column — left 3/5 */}
        <div className="md:col-span-3 min-w-0 flex flex-col justify-center py-10 md:py-16 md:pr-12">
          {/* Category + byline */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-crimson)]">
              {post.category}
            </span>
            <div className="h-px w-8 bg-[var(--color-rule)]" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
              {post.subtitle}
            </span>
            <div className="h-px w-8 bg-[var(--color-rule)]" />
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-subtle)]">
              {post.year}
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-balance text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
            {post.title}
          </h2>

          {/* Byline */}
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)] mb-6">
            By <span className="text-[var(--color-ink)]">{SiteConfig.name}</span>
          </p>

          {/* Standfirst — drop cap on the first letter */}
          <p className="lead-standfirst min-w-0 font-serif text-[15px] leading-relaxed text-[var(--color-muted)] mb-8 max-w-prose line-clamp-2">
            {post.excerpt}
          </p>

          {/* Continued on the inside — newspaper "jump" line */}
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-crimson)] group-hover:gap-3 transition-all duration-200">
            {SiteConfig.paper.cta.leadStory} <FiArrowRight size={12} />
          </span>
        </div>

        {/* Image — right 2/5, full bleed */}
        {post.image && (
          <div className="md:col-span-2 relative overflow-hidden aspect-[4/3] md:aspect-auto md:min-h-[320px] bg-[var(--color-rule)]">
            <motion.img
              src={post.image}
              alt={post.title}
              className="story-image absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
            <div className="absolute inset-0 bg-[var(--color-crimson)] opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          </div>
        )}
      </a>
    </FadeIn>
  )
}

function SecondaryStory({ post, index }: { post: Post; index: number }) {
  const folio = String(index + 2).padStart(2, '0')
  return (
    <FadeIn
      delay={0.05 * index}
      className="h-full sm:px-8 sm:first:pl-0 sm:last:pr-0 sm:border-l sm:border-[var(--color-rule)] sm:first:border-l-0"
    >
      <a
        href={getPostPath(post.id)}
        className="group flex h-full flex-col pt-5 cursor-pointer border-t border-[var(--color-rule)]"
      >
        {/* Folio numeral + metadata strip — mirrors LeadStory rhythm */}
        <div className="flex items-baseline gap-4 mb-5">
          <span className="font-mono text-[2.5rem] tracking-tight leading-none text-[var(--color-rule)] group-hover:text-[var(--color-crimson)] transition-colors duration-300">
            {folio}
          </span>
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-crimson)]">
              {post.category}
            </span>
            {post.subtitle && (
              <>
                <div className="h-px w-6 bg-[var(--color-rule)]" />
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)] truncate">
                  {post.subtitle}
                </span>
              </>
            )}
            <div className="h-px w-6 bg-[var(--color-rule)]" />
            <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--color-subtle)]">
              {post.year}
            </span>
          </div>
        </div>

        <h3 className="font-display text-balance text-[1.25rem] leading-snug text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
          {post.title}
        </h3>

        <p className="font-serif text-[13px] leading-relaxed text-[var(--color-muted)] flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Quiet sign-off footer */}
        <div className="mt-4 pt-4 border-t border-[var(--color-rule)] flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-subtle)]">
            {post.formattedReadTime ?? post.formattedDate}
          </span>
          <FiArrowRight size={11} className="text-[var(--color-rule)] group-hover:text-[var(--color-crimson)] transition-colors duration-200 shrink-0" />
        </div>
      </a>
    </FadeIn>
  )
}

export function Featured() {
  const [lead, ...secondaries] = featuredPosts
  const secondaryGridClass =
    secondaries.length === 1 ? 'sm:grid-cols-1 md:grid-cols-1'
      : secondaries.length === 2 ? 'sm:grid-cols-2 md:grid-cols-2'
        : secondaries.length === 3 ? 'sm:grid-cols-2 md:grid-cols-3'
          : 'sm:grid-cols-2 md:grid-cols-4'

  return (
    // Top padding stays shallow — the Hero's fold rule already provides the break
    <section id="featured" className="px-6 md:px-12 pt-8 pb-16 md:pt-10 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section masthead — double-rule, folio left, byline right */}
        <FadeIn>
          <SectionBanner folio={frontPage.folio} label={frontPage.label} note={frontPage.note} />
        </FadeIn>

        {/* Lead story */}
        <LeadStory post={lead} />

        {/* Secondary columns — hairline rules stand in the gutters at sm+ */}
        {secondaries.length > 0 && (
          <div className={`grid grid-cols-1 ${secondaryGridClass} gap-8 sm:gap-x-0 pt-8`}>
            {secondaries.map((post, i) => (
              <SecondaryStory key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

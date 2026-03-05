import { motion } from 'framer-motion'
import { FiExternalLink } from 'react-icons/fi'
import { featuredPosts } from '@/data/posts'
import { Post } from '@/models/Post'
import { FadeIn } from '@/components/ui/FadeIn'
import { Tag } from '@/components/ui/Tag'
import { SectionLabel } from '@/components/ui/SectionLabel'

/* ─── Projects ───────────────────────────────────────────────────────────── */
/* Selected Work: filtered view of posts where featured === true.             */
/* Alternating full-bleed cards: image left on even, right on odd.           */

function ProjectCard({ post, index }: { post: Post; index: number }) {
  const isEven = index % 2 === 0

  return (
    <FadeIn delay={0.05 * index} className="group">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-lg border border-[var(--color-rule)] hover:border-[var(--color-crimson)] transition-colors duration-500">

        {/* Image pane */}
        {post.image && (
          <div
            className={`relative overflow-hidden bg-[var(--color-rule)] aspect-[4/3] md:aspect-auto ${
              isEven ? 'md:order-1' : 'md:order-2'
            }`}
            style={{ minHeight: '280px' }}
          >
            <motion.img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
            <div className="absolute inset-0 bg-[var(--color-crimson)] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          </div>
        )}

        {/* Content pane */}
        <div
          className={`flex flex-col justify-center p-8 md:p-12 bg-[var(--color-surface)] ${
            post.image
              ? isEven ? 'md:order-2' : 'md:order-1'
              : 'md:col-span-2'
          }`}
        >
          {/* Year + subtitle */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[11px] tracking-widest text-[var(--color-crimson)]">
              {post.year}
            </span>
            {post.subtitle && (
              <>
                <div className="h-px flex-1 bg-[var(--color-rule)] max-w-[40px]" />
                <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-subtle)]">
                  {post.subtitle}
                </span>
              </>
            )}
          </div>

          <h3 className="font-display text-[1.75rem] leading-tight text-[var(--color-ink)] mb-4">
            {post.title}
          </h3>

          <p className="font-body text-[14px] leading-relaxed text-[var(--color-muted)] mb-6">
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          )}

          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[12px] tracking-wide text-[var(--color-crimson)] hover:underline"
            >
              View project <FiExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </FadeIn>
  )
}

export function Projects() {
  return (
    <section id="projects" className="px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionLabel text="Selected Work" index="01" />
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[var(--color-ink)] mb-16 leading-tight">
            Projects that ship.
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-6">
          {featuredPosts.map((post, i) => (
            <ProjectCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

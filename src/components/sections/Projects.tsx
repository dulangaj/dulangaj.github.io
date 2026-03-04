import { motion } from 'framer-motion'
import { FiExternalLink } from 'react-icons/fi'
import { projects } from '@/data/projects'
import { Project } from '@/models/Project'
import { FadeIn } from '@/components/ui/FadeIn'
import { Tag } from '@/components/ui/Tag'
import { SectionLabel } from '@/components/ui/SectionLabel'

/* ─── Projects ───────────────────────────────────────────────────────────── */
/* Alternating full-bleed cards: image left on even, right on odd.          */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0

  return (
    <FadeIn delay={0.05 * index} className="group">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-lg border border-[var(--color-rule)] hover:border-[var(--color-crimson)] transition-colors duration-500`}
      >
        {/* Image pane */}
        {project.hasImage && (
          <div
            className={`relative overflow-hidden bg-[var(--color-rule)] aspect-[4/3] md:aspect-auto ${
              isEven ? 'md:order-1' : 'md:order-2'
            }`}
            style={{ minHeight: '280px' }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            />
            {/* Crimson overlay on hover */}
            <div className="absolute inset-0 bg-[var(--color-crimson)] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          </div>
        )}

        {/* Content pane */}
        <div
          className={`flex flex-col justify-center p-8 md:p-12 bg-[var(--color-surface)] ${
            project.hasImage
              ? isEven
                ? 'md:order-2'
                : 'md:order-1'
              : 'md:col-span-2'
          }`}
        >
          {/* Year + subtitle */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[11px] tracking-widest text-[var(--color-crimson)]">
              {project.year}
            </span>
            <div className="h-px flex-1 bg-[var(--color-rule)] max-w-[40px]" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-subtle)]">
              {project.subtitle}
            </span>
          </div>

          <h3 className="font-display text-[1.75rem] leading-tight text-[var(--color-ink)] mb-4">
            {project.title}
          </h3>

          <p className="font-body text-[14px] leading-relaxed text-[var(--color-muted)] mb-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tagList.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          {/* Link */}
          {project.link && (
            <a
              href={project.link}
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

/* No-image card for projects without photos */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <FadeIn delay={0.05 * index}>
      <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-[var(--color-rule)] items-start hover:border-[var(--color-crimson)] transition-colors duration-300">
        <div className="md:col-span-1 font-mono text-[11px] text-[var(--color-subtle)] tracking-widest pt-1">
          {project.year}
        </div>
        <div className="md:col-span-7">
          <h3 className="font-display text-[1.25rem] text-[var(--color-ink)] mb-1 group-hover:text-[var(--color-crimson)] transition-colors duration-300">
            {project.title}
          </h3>
          <p className="font-body text-[13px] text-[var(--color-muted)] leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="md:col-span-4 flex flex-wrap gap-2 justify-start md:justify-end pt-1">
          {project.tagList.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

export function Projects() {
  const withImage    = projects.filter((p) => p.hasImage)
  const withoutImage = projects.filter((p) => !p.hasImage)

  return (
    <section id="projects" className="px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionLabel text="Selected Work" index="01" />
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[var(--color-ink)] mb-16 leading-tight">
            Projects that ship.
          </h2>
        </FadeIn>

        {/* Full-bleed image cards */}
        <div className="flex flex-col gap-6 mb-16">
          {withImage.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Text-only rows */}
        {withoutImage.length > 0 && (
          <div className="border-t border-[var(--color-rule)]">
            {withoutImage.map((project, i) => (
              <ProjectRow key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

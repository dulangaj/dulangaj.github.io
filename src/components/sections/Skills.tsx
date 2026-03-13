import { FadeIn } from '@/components/ui/FadeIn'
import { SectionLabel } from '@/components/ui/SectionLabel'

const skillGroups = [
  {
    title: 'Backend & Data',
    items: ['Java', 'Spring Boot', 'Python', 'SQL', 'Kafka', 'Microservices'],
  },
  {
    title: 'Infrastructure & Delivery',
    items: ['Linux', 'Jenkins', 'CI/CD', 'Production Support', 'Observability', 'Automation'],
  },
  {
    title: 'Product & Collaboration',
    items: ['System Design', 'Stakeholder Communication', 'Mentoring', 'Cross-region Delivery', 'Reliability Engineering'],
  },
]

export function Skills() {
  return (
    <section id="skills" className="px-6 md:px-12 py-24 bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <SectionLabel text="Skills" index="03" />
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-[var(--color-ink)] mb-4 leading-tight">
            What I build with.
          </h2>
          <p className="font-body text-[15px] text-[var(--color-muted)] mb-12 max-w-2xl">
            Core technical strengths from production work in financial systems, plus the collaboration skills needed to ship reliably with global teams.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group, idx) => (
            <FadeIn key={group.title} delay={0.06 * idx}>
              <article className="h-full rounded-lg border border-[var(--color-rule)] p-6 bg-[var(--color-paper)]">
                <h3 className="font-display text-[1.2rem] text-[var(--color-ink)] mb-4">{group.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="font-mono text-[11px] tracking-wide text-[var(--color-muted)] px-2.5 py-1 rounded-full border border-[var(--color-rule)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

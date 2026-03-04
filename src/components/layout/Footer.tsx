import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── Footer ─────────────────────────────────────────────────────────────── */

const SocialIcon = {
  GitHub:   FiGithub,
  LinkedIn: FiLinkedin,
  Email:    FiMail,
} as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      className="border-t border-[var(--color-rule)] mt-32"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Left: identity */}
        <div>
          <p className="font-display text-xl text-[var(--color-ink)] mb-1">
            {SiteConfig.name}
          </p>
          <p className="font-mono text-[12px] text-[var(--color-subtle)] tracking-wide">
            {SiteConfig.location} &nbsp;·&nbsp; Open to relocation
          </p>
          <a
            href={SiteConfig.mailtoLink}
            className="mt-3 inline-block font-mono text-[12px] text-[var(--color-crimson)] hover:underline tracking-wide"
          >
            {SiteConfig.email}
          </a>
        </div>

        {/* Right: socials + copyright */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex items-center gap-5">
            {SiteConfig.socials.map((social) => {
              const Icon = SocialIcon[social.platform as keyof typeof SocialIcon]
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target={social.platform !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200"
                >
                  {Icon && <Icon size={18} />}
                </a>
              )
            })}
          </div>
          <p className="font-mono text-[11px] text-[var(--color-subtle)] tracking-wide">
            © {year} {SiteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  )
}

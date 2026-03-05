/* ─── SiteConfig Singleton ───────────────────────────────────────────────── */
/* Central config object — one import gives you the whole site identity.     */

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  platform: string
  url: string
  ariaLabel: string
}

export interface SiteConfigProps {
  name: string
  title: string
  tagline: string
  bio: string
  location: string
  email: string
  nav: NavItem[]
  socials: SocialLink[]
}

class SiteConfigClass {
  readonly name:     string
  readonly title:    string
  readonly tagline:  string
  readonly bio:      string
  readonly location: string
  readonly email:    string
  readonly nav:      NavItem[]
  readonly socials:  SocialLink[]

  constructor(props: SiteConfigProps) {
    this.name     = props.name
    this.title    = props.title
    this.tagline  = props.tagline
    this.bio      = props.bio
    this.location = props.location
    this.email    = props.email
    this.nav      = props.nav
    this.socials  = props.socials
  }

  get initials(): string {
    return this.name
      .split(' ')
      .map((w) => w[0])
      .join('')
  }

  get mailtoLink(): string {
    return `mailto:${this.email}`
  }
}

/* ─── Singleton Instance ─────────────────────────────────────────────────── */

export const SiteConfig = new SiteConfigClass({
  name:     'Dulanga Jayawardena',
  title:    'Software Engineer',
  tagline:  'Building scalable systems for financial markets.',
  bio:      'Software engineer with 4+ years of experience building production-grade systems for financial markets. Based in Hong Kong. Specialises in Java and Python, with hands-on experience across cloud platforms, event-driven architectures, and quantitative risk pipelines.',
  location: 'Hong Kong',
  email:    'dulangajay@gmail.com',
  nav: [
    { label: 'Projects',    href: '#projects'    },
    { label: 'Experience',  href: '#experience'  },
    { label: 'Writing',     href: '#writing'     },
    { label: 'Contact',     href: '#contact'     },
  ],
  socials: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/dulangaj', ariaLabel: 'LinkedIn profile' },
    { platform: 'GitHub',   url: 'https://github.com/dulangaj',      ariaLabel: 'GitHub profile'   },
    { platform: 'Email',    url: 'mailto:dulangajay@gmail.com',       ariaLabel: 'Send email'       },
  ],
})

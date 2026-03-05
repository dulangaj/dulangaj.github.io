/* ─── Post Model ─────────────────────────────────────────────────────────── */
/* Single source of truth for all portfolio items — writing, projects,        */
/* education. The Projects section is just a filtered view (featured: true).  */

export interface PostProps {
  id:       string
  title:    string
  excerpt:  string
  date:     string          // ISO format: YYYY-MM-DD
  category: string
  image?:   string
  readTime?: number         // minutes
  link?:    string
  // Project-specific (only set when featured: true)
  featured?:  boolean
  subtitle?:  string        // e.g. "Morgan Stanley", "Academic Project"
  tags?:      string[]
}

export class Post {
  readonly id:       string
  readonly title:    string
  readonly excerpt:  string
  readonly date:     string
  readonly category: string
  readonly image?:   string
  readonly readTime?: number
  readonly link?:    string
  readonly featured: boolean
  readonly subtitle?: string
  readonly tags:     string[]

  constructor(props: PostProps) {
    this.id       = props.id
    this.title    = props.title
    this.excerpt  = props.excerpt
    this.date     = props.date
    this.category = props.category
    this.image    = props.image
    this.readTime = props.readTime
    this.link     = props.link
    this.featured = props.featured ?? false
    this.subtitle = props.subtitle
    this.tags     = props.tags ?? []
  }

  get formattedDate(): string {
    return new Date(this.date).toLocaleDateString('en-GB', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    })
  }

  get year(): string {
    return String(new Date(this.date).getFullYear())
  }
}

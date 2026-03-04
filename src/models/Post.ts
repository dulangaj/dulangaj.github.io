/* ─── Blog Post Model ────────────────────────────────────────────────────── */

export interface PostProps {
  id: string
  title: string
  excerpt: string
  date: string          // ISO format: YYYY-MM-DD
  category: string
  image?: string
  readTime?: number     // minutes
  link?: string
}

export class Post {
  readonly id: string
  readonly title: string
  readonly excerpt: string
  readonly date: string
  readonly category: string
  readonly image?: string
  readonly readTime?: number
  readonly link?: string

  constructor(props: PostProps) {
    this.id       = props.id
    this.title    = props.title
    this.excerpt  = props.excerpt
    this.date     = props.date
    this.category = props.category
    this.image    = props.image
    this.readTime = props.readTime
    this.link     = props.link
  }

  get formattedDate(): string {
    return new Date(this.date).toLocaleDateString('en-GB', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    })
  }

  get year(): number {
    return new Date(this.date).getFullYear()
  }
}

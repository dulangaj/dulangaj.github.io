/* ─── Project Model ──────────────────────────────────────────────────────── */

export interface ProjectProps {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  image?: string
  year: string
  link?: string
  featured?: boolean
}

export class Project {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly tags: string[]
  readonly image?: string
  readonly year: string
  readonly link?: string
  readonly featured: boolean

  constructor(props: ProjectProps) {
    this.id          = props.id
    this.title       = props.title
    this.subtitle    = props.subtitle
    this.description = props.description
    this.tags        = props.tags
    this.image       = props.image
    this.year        = props.year
    this.link        = props.link
    this.featured    = props.featured ?? false
  }

  get tagList(): string[] {
    return this.tags
  }

  get hasImage(): boolean {
    return Boolean(this.image)
  }
}

/* ─── Experience Model ───────────────────────────────────────────────────── */

export interface ExperienceProps {
  id: string
  role: string
  company: string
  location: string
  period: string
  startYear: number
  endYear?: number       // undefined = present
  description: string
  highlights: string[]
  tags: string[]
  image?: string
}

export class Experience {
  readonly id: string
  readonly role: string
  readonly company: string
  readonly location: string
  readonly period: string
  readonly startYear: number
  readonly endYear?: number
  readonly description: string
  readonly highlights: string[]
  readonly tags: string[]
  readonly image?: string

  constructor(props: ExperienceProps) {
    this.id          = props.id
    this.role        = props.role
    this.company     = props.company
    this.location    = props.location
    this.period      = props.period
    this.startYear   = props.startYear
    this.endYear     = props.endYear
    this.description = props.description
    this.highlights  = props.highlights
    this.tags        = props.tags
    this.image       = props.image
  }

  get isCurrent(): boolean {
    return this.endYear === undefined
  }

  get durationLabel(): string {
    const end = this.endYear ?? new Date().getFullYear()
    const years = end - this.startYear
    if (years === 0) return 'Less than a year'
    return `${years} year${years !== 1 ? 's' : ''}`
  }
}

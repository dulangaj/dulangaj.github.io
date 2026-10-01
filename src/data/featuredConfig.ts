/* ─── Featured Posts Config ───────────────────────────────────────────────── */
/* Manual configuration for posts that appear in the Featured section.         */
/* Provides a curated, condensed excerpt and an optional image override.       */
/* The id must match the posts/ filename stem (e.g. 2025-05-01-post-name).    */

export interface FeaturedPostConfig {
  id:      string
  excerpt: string
  image?:  string   // overrides the post's frontmatter image when set
}

export const featuredConfig: FeaturedPostConfig[] = [
  {
    id:      '2025-05-01-morgan-stanley-equity-risk',
    excerpt: "How Morgan Stanley's Equity Risk Technology team builds the platforms its traders and risk managers use on desks worldwide.",
  },
  {
    id:      '2020-05-31-social-network-opinion-dynamics',
    excerpt: 'How opinions spread through a network. The paper compares the DeGroot and Bounded Confidence models, then proposes a dynamic self-appraisal mechanism.',
    image:   '/assets/img/dulanga-jayawardena-heatmap-2017.png',
  },
  {
    id:      '2020-12-31-vbrands',
    excerpt: 'Automating e-commerce operations and training staff at a multi-brand retailer in Hong Kong.',
  },
]

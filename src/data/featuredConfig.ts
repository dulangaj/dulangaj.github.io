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
    excerpt: "Inside Morgan Stanley's Equity Risk Technology team: building reliable platforms used by traders and risk managers across global desks.",
  },
  {
    id:      '2020-05-31-social-network-opinion-dynamics',
    excerpt: 'How opinions spread in networks: comparing DeGroot and Bounded Confidence models, then proposing a dynamic self-appraisal mechanism.',
    image:   '/assets/img/17.12_heatmap.png',
  },
  {
    id:      '2020-12-31-vbrands',
    excerpt: 'At a Hong Kong multi-brand retailer, I modernized e-commerce operations with automation, integrations, and staff enablement.',
  },
  {
    id:      '2018-12-01-wearable-safety-backpack',
    excerpt: 'A Dartmouth project to make night walking safer: a visibility-first backpack with embedded LEDs, conductive thread, and smart power control.',
  },
  {
    id:      '2017-12-01-restaurant-recommender',
    excerpt: "A restaurant discovery tool built with university friends: rank OpenRice results by your own priorities instead of the default algorithm.",
  },
]

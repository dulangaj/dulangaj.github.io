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
    excerpt: 'Inside the Equity Risk Technology team at Morgan Stanley — production systems for traders and risk managers built in Java, Kafka, and KDB+.',
  },
  {
    id:      '2020-05-31-social-network-opinion-dynamics',
    excerpt: 'Comparing consensus models across five network topologies — and proposing a dynamic self-appraisal mechanism to make opinion modelling more realistic.',
    image:   '/assets/img/17.12_heatmap.png',
  },
  {
    id:      '2020-12-31-vbrands',
    excerpt: 'Technology consultant at a Hong Kong multi-brand retail group — automating special-orders, building catalog pipelines, and shipping e-commerce features.',
  },
  {
    id:      '2018-12-01-wearable-safety-backpack',
    excerpt: 'Over 75% of pedestrian fatalities happen after dark. We designed a backpack to fix that — embedded LEDs, conductive thread, and gyroscope-managed power.',
  },
  {
    id:      '2017-12-01-restaurant-recommender',
    excerpt: "A custom scoring engine on OpenRice data — rank restaurants by your own weights, not the platform's algorithm. Built with my university friends. It worked.",
  },
]

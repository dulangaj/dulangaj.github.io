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
    excerpt: 'Inside the Equity Risk Technology team at Morgan Stanley — building scalable, globally deployed systems for traders and risk managers across Java, Kafka, KDB+, and Spring Boot.',
  },
  {
    id:      '2020-05-31-social-network-opinion-dynamics',
    excerpt: 'Comparing DeGroot and Bounded Confidence models across five network topologies — and proposing a dynamic influence-based self-appraisal mechanism to make consensus modelling more realistic.',
    image:   '/assets/img/17.12_heatmap.png',
  },
  {
    id:      '2020-12-31-vbrands',
    excerpt: 'Automating special-orders workflows, building catalog pipelines, and shipping e-commerce features at a multi-brand retail group — hands-on from backend scripts to stakeholder training.',
  },
  {
    id:      '2018-12-01-wearable-safety-backpack',
    excerpt: 'Over 75% of pedestrian fatalities happen after dark. We designed a backpack that fixes that — with embedded LEDs, conductive thread, gyroscope power management, and three full hardware iterations.',
  },
  {
    id:      '2017-12-01-restaurant-recommender',
    excerpt: "Built a customizable scoring engine on top of OpenRice data so my university friends and I could find great restaurants by our own weights — not the platform's algorithm. It worked.",
  },
]

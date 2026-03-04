import { Post } from '@/models/Post'

/* ─── Posts Repository ───────────────────────────────────────────────────── */
/* Ordered most-recent first. Components consume this array.                 */

export const posts = [
  new Post({
    id:       'equity-risk-2025',
    title:    'Building Software for Equity Risk Management',
    excerpt:  'How we designed a real-time P&L attribution pipeline that processes ten million equity positions daily — and what we learned about latency, correctness, and team structure along the way.',
    date:     '2025-05-01',
    category: 'Engineering',
    image:    '/assets/img/25.04_hongkong.jpeg',
    readTime: 8,
  }),
  new Post({
    id:       'opinion-dynamics-2020',
    title:    'Social Network Opinion Dynamics',
    excerpt:  'Computational modelling of polarisation propagation in large social graphs. A walkthrough of the simulation framework, the surprising results, and what they imply for platform design.',
    date:     '2020-05-31',
    category: 'Research',
    image:    '/assets/img/17.12_heatmap.png',
    readTime: 6,
  }),
  new Post({
    id:       'vbrands-2020',
    title:    'Digital Transformation at a Retail Group',
    excerpt:  'Notes from leading a B2B platform build from scratch — the technical decisions, the stakeholder dynamics, and why migrating off Excel is always harder than it looks.',
    date:     '2020-12-31',
    category: 'Product',
    image:    '/assets/img/20.12_vbrands.jpeg',
    readTime: 5,
  }),
  new Post({
    id:       'dartmouth-2018',
    title:    'Engineering Exchange at Dartmouth',
    excerpt:  'Six months at Thayer School of Engineering: prototyping a wearable safety device, learning how American engineering education differs, and the value of cross-disciplinary teams.',
    date:     '2018-12-01',
    category: 'Experience',
    image:    '/assets/img/18.09_window.jpeg',
    readTime: 4,
  }),
]

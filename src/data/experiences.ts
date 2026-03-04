import { Experience } from '@/models/Experience'

/* ─── Experiences Repository ─────────────────────────────────────────────── */
/* Ordered most-recent first. Components consume this array.                 */

export const experiences = [
  new Experience({
    id:          'morgan-stanley',
    role:        'Software Engineer',
    company:     'Morgan Stanley',
    location:    'Hong Kong',
    period:      '2021 – Present',
    startYear:   2021,
    description: 'Building production-grade risk and pricing systems for the Equity Derivatives desk. Working across the full stack from low-latency Java services to Python analytics pipelines.',
    highlights: [
      'Engineered a real-time P&L attribution engine processing 10M+ positions daily',
      'Reduced end-of-day risk report generation time by 40% through Kafka-based parallelisation',
      'Led migration of legacy Sybase procedures to a modern SQL + KDB+ time-series stack',
      'Mentored two junior engineers through onboarding and first production deployments',
    ],
    tags: ['Java', 'Python', 'Kafka', 'KDB+', 'Spring Boot', 'SQL'],
    image: '/assets/img/25.04_hongkong.jpeg',
  }),
  new Experience({
    id:          'vbrands',
    role:        'Technology Consultant & Digital Operations',
    company:     'VBrands',
    location:    'Hong Kong',
    period:      '2020',
    startYear:   2020,
    endYear:     2021,
    description: 'Drove digital transformation for a multi-brand retail group, shipping a B2B inventory and operations platform from zero to production.',
    highlights: [
      'Built a Python/Flask microservice backend with REST API consumed by 200+ retail partners',
      'Migrated manual order workflows to an automated pipeline, cutting processing time by 60%',
      'Developed the client-facing WordPress storefront and custom WooCommerce integrations',
    ],
    tags: ['Python', 'Flask', 'WordPress', 'REST API', 'WooCommerce'],
    image: '/assets/img/20.12_vbrands.jpeg',
  }),
  new Experience({
    id:          'cuhk',
    role:        'Research Assistant — Systems Engineering',
    company:     'The Chinese University of Hong Kong',
    location:    'Hong Kong',
    period:      '2020',
    startYear:   2020,
    endYear:     2020,
    description: 'Conducted computational social science research on opinion dynamics and polarisation propagation in large-scale social networks.',
    highlights: [
      'Simulated polarisation models across networks of 100k+ nodes using Python and NetworkX',
      'Produced a research paper submitted to IEEE SMC 2020',
    ],
    tags: ['Python', 'NumPy', 'NetworkX', 'Research'],
  }),
  new Experience({
    id:          'dartmouth',
    role:        'Engineering Exchange Student',
    company:     'Dartmouth College',
    location:    'Hanover, NH, USA',
    period:      '2018',
    startYear:   2018,
    endYear:     2018,
    description: 'Participated in the Thayer School of Engineering exchange, completing two capstone engineering design projects.',
    highlights: [
      'Designed a sensor-integrated wearable safety backpack prototyped with Arduino and SolidWorks',
      'Collaborated with a cross-disciplinary team on a sustainable materials design challenge',
    ],
    tags: ['Arduino', 'C', 'SolidWorks', 'Engineering Design'],
    image: '/assets/img/18.09_window.jpeg',
  }),
]

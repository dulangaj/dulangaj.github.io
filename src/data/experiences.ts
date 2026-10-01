import { Experience } from '@/models/Experience'

/* ─── Experiences Repository ─────────────────────────────────────────────── */
/* Ordered most-recent first. Components consume this array.                 */

export const experiences = [
  new Experience({
    id:          'morgan-stanley',
    role:        'Risk Systems Developer',
    company:     'Morgan Stanley',
    location:    'Hong Kong',
    period:      '2021 – 2025',
    startYear:   2021,
    endYear:     2025,
    description: 'Built and ran risk systems for front-office trading teams in four regions.',
    highlights: [
      'Built Java and Spring microservices for risk exposure across equities, derivatives, and FX',
      'Subject-matter expert for the prod-parallel environment, in charge of its performance, capacity, and coordination across regions',
      'Automated end-of-day and QA workflows in Python, Perl, Bash, and SQL, and provided Level 3 support for JVM and C++ systems in four regions',
    ],
    tags: ['Java', 'Spring', 'Python', 'Perl', 'Bash', 'SQL', 'Kafka', 'MQ', 'Jenkins'],
    image: '/assets/img/dulanga-jayawardena-icc-2022.jpeg',
  }),
  new Experience({
    id:          'vbrands',
    role:        'Technology Consultant',
    company:     'VBrands',
    location:    'Hong Kong',
    period:      '2020',
    startYear:   2020,
    endYear:     2020,
    description: 'Ran e-commerce and automated operations for a multi-brand retailer in Hong Kong.',
    highlights: [
      'Owned e-commerce deployments, integrations, and performance tuning, and advised leadership on technology',
      'Wrote Python scripts for fulfillment, shipping labels, and product data that replaced manual work',
      'Rolled out the new workflows with the operations team and trained staff to use them',
    ],
    tags: ['Python', 'E-commerce', 'Automation', 'Integrations', 'Operations'],
    image: '/assets/img/dulanga-jayawardena-vbrands-2020.jpeg',
  }),
  new Experience({
    id:          'cuhk',
    role:        'B.Eng. (Hons), Systems Engineering',
    company:     'The Chinese University of Hong Kong',
    location:    'Hong Kong',
    period:      '2016 – 2020',
    startYear:   2016,
    endYear:     2020,
    description: 'Studied systems engineering at CUHK on a full scholarship, with an exchange program at Dartmouth.',
    highlights: [
      'Selected for an exchange program at Dartmouth College',
      "Awarded Full Academic Scholarship, Morningside Scholarship, and Engineering Scholarship",
      "Named to the Master's List",
    ],
    tags: ['Systems Engineering', 'Dartmouth Exchange', 'Scholarships'],
    image: '/assets/img/dulanga-jayawardena-graduation-2016.jpeg',
  }),
  new Experience({
    id:          'we-are-designers',
    role:        'Mobile App Developer',
    company:     'We Are Designers',
    location:    'Sri Lanka',
    period:      '2015 – 2016',
    startYear:   2015,
    endYear:     2016,
    description: 'Built Android and kiosk apps alongside the studio\'s designers.',
    highlights: [
      'Built custom interfaces for Android and kiosk apps',
      'Turned designers\' mockups into working user flows',
      'Built responsive front-end components that ran on both phones and kiosks',
    ],
    tags: ['Android', 'Mobile', 'UI/UX', 'Frontend'],
  }),
]

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
    description: 'Built and operated reliable risk systems for front-office teams across multiple regions.',
    highlights: [
      'Built Java and Spring microservices for risk exposure across equities, derivatives, and FX, improving accuracy and stability',
      'SME for the prod-parallel environment, driving scalability, performance, and global coordination',
      'Automated end-of-day and QA workflows with Python, Perl, Bash, and SQL, while providing Level 3 support for JVM and C++ systems across four regions',
    ],
    tags: ['Java', 'Spring', 'Python', 'Perl', 'Bash', 'SQL', 'Kafka', 'MQ', 'Jenkins'],
    image: '/assets/img/22_icc.jpeg',
  }),
  new Experience({
    id:          'vbrands',
    role:        'Technology Consultant',
    company:     'VBrands',
    location:    'Hong Kong',
    period:      '2020',
    startYear:   2020,
    endYear:     2020,
    description: 'Modernized e-commerce and operations for a multi-brand retailer in Hong Kong.',
    highlights: [
      'Owned e-commerce deployments, integrations, and performance tuning while advising leadership on technology direction',
      'Built Python automations for fulfillment, label generation, and product-data pipelines, replacing error-prone manual work',
      'Partnered with operations teams to roll out new workflows and train staff for sustained adoption',
    ],
    tags: ['Python', 'E-commerce', 'Automation', 'Integrations', 'Operations'],
    image: '/assets/img/20.12_vbrands.jpeg',
  }),
  new Experience({
    id:          'cuhk',
    role:        'B.Eng. (Hons), Systems Engineering',
    company:     'The Chinese University of Hong Kong',
    location:    'Hong Kong',
    period:      '2016 – 2020',
    startYear:   2016,
    endYear:     2020,
    description: 'Completed systems engineering at CUHK on full scholarship, with international exchange in the U.S.',
    highlights: [
      'Selected for an exchange program at Dartmouth College (U.S.A.)',
      "Awarded Full Academic Scholarship, Morningside Scholarship, and Engineering Scholarship",
      "Named to the Master's List",
    ],
    tags: ['Systems Engineering', 'Dartmouth Exchange', 'Scholarships'],
    image: '/assets/img/16.11_graduation.jpeg',
  }),
  new Experience({
    id:          'we-are-designers',
    role:        'Mobile App Developer',
    company:     'We Are Designers',
    location:    'Sri Lanka',
    period:      '2015 – 2016',
    startYear:   2015,
    endYear:     2016,
    description: 'Built Android and kiosk applications in close collaboration with designers.',
    highlights: [
      'Built custom UI/UX experiences across Android and kiosk applications',
      'Collaborated closely with designers to translate concepts into production-ready user flows',
      'Implemented responsive front-end components across mobile and kiosk form factors',
    ],
    tags: ['Android', 'Mobile', 'UI/UX', 'Frontend'],
  }),
]

import { Project } from '@/models/Project'

/* ─── Projects Repository ────────────────────────────────────────────────── */
/* Add or remove Project entries here. Components consume this array.        */

const projectData = [
  new Project({
    id:          'equity-risk',
    title:       'Equity Risk Management',
    subtitle:    'Morgan Stanley',
    description: 'Designed and shipped a real-time equity risk computation pipeline processing millions of positions daily. Built in Java with Apache Kafka for event streaming and KDB+ for time-series analytics, reducing P&L attribution latency by 40%.',
    tags:        ['Java', 'Kafka', 'KDB+', 'Spring Boot', 'Risk'],
    image:       '/assets/img/25.04_hongkong.jpeg',
    year:        '2025',
    featured:    true,
  }),
  new Project({
    id:          'vbrands',
    title:       'Digital Operations Platform',
    subtitle:    'VBrands',
    description: 'Led full-stack development of a B2B digital operations platform, migrating legacy workflows to a Python/Flask microservice architecture. Shipped a real-time inventory dashboard consumed by 200+ retail partners.',
    tags:        ['Python', 'Flask', 'WordPress', 'REST API'],
    image:       '/assets/img/20.12_vbrands.jpeg',
    year:        '2020',
  }),
  new Project({
    id:          'opinion-dynamics',
    title:       'Social Network Opinion Dynamics',
    subtitle:    'Research · CUHK',
    description: 'Simulated and analysed polarisation propagation across large-scale social graphs using NumPy and NetworkX. Paper submitted to the IEEE International Conference on Systems, Man, and Cybernetics.',
    tags:        ['Python', 'NumPy', 'NetworkX', 'Research'],
    image:       '/assets/img/17.12_heatmap.png',
    year:        '2020',
  }),
  new Project({
    id:          'wearable-backpack',
    title:       'Wearable Safety Backpack',
    subtitle:    'Dartmouth Engineering Exchange',
    description: 'Designed a sensor-integrated safety backpack for cyclists with proximity alerts and automatic brake lights. Hardware prototyped with Arduino, casing modelled in SolidWorks, and embedded software written in C.',
    tags:        ['Arduino', 'C', 'SolidWorks', 'IoT'],
    image:       '/assets/img/18.10_roadTest.jpeg',
    year:        '2018',
  }),
  new Project({
    id:          'restaurant-recommender',
    title:       'Restaurant Recommender System',
    subtitle:    'Academic Project',
    description: 'Built a collaborative-filtering recommendation engine in Python with a Tkinter GUI, trained on 50k+ Yelp reviews. Achieved 82% precision@5 using matrix factorisation.',
    tags:        ['Python', 'Tkinter', 'Machine Learning', 'Collaborative Filtering'],
    year:        '2017',
  }),
]

export const projects = projectData
export const featuredProjects = projectData.filter((p) => p.featured)

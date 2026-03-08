export type PhotoCategory = 'Education' | 'Work' | 'Travel'

export interface PhotoMetadata {
  lat?: number
  lng?: number
  date?: string
  title?: string
  subtitle?: string
  location?: string
  description?: string
  category?: PhotoCategory
  disableGeneratedPosts?: boolean
}

export const photoMetadata: Record<string, PhotoMetadata> = {
  '15.02_moir.jpeg': {
    lat: 6.8778,
    lng: 79.8769,
    title: 'Excelling at Elizabeth Moir School',
    subtitle: 'Elizabeth Moir School',
    location: 'Colombo, Sri Lanka',
    category: 'Education',
  },
  '15.07_edexcel.jpeg': {
    lat: 6.9271,
    lng: 79.8612,
    title: 'A Level Examinations',
    subtitle: 'Edexcel · Sri Lanka',
    location: 'Colombo, Sri Lanka',
    category: 'Education',
  },
  '16.11_graduation.jpeg': {
    lat: 22.4194,
    lng: 114.2063,
    title: 'Studying Systems Engineering at CUHK',
    subtitle: 'The Chinese University of Hong Kong',
    location: 'Shatin, Hong Kong',
    category: 'Education',
  },
  '17.12_heatmap.png': {
    lat: 22.4196,
    lng: 114.2060,
    title: 'Restaurant Recommender — Heatmap Analysis',
    subtitle: 'Academic Project · CUHK',
    location: 'Shatin, Hong Kong',
    category: 'Education',
  },
  '18.07_london_bridge.jpeg': {
    title: 'Following my roommate through London Bridge',
    location: 'London, England',
    description: 'My heart was in my mouth, as I dropped my phone snapping this.',
    category: 'Travel',
  },
  '18.09_window.jpeg': {
    lat: 43.7022,
    lng: -72.2896,
    title: 'Exchange Semester at Dartmouth College',
    subtitle: 'Dartmouth College',
    location: 'Hanover, NH, USA',
    category: 'Education',
  },
  '18.10_canoe.jpeg': {
    lat: 43.6983,
    lng: -72.3067,
    title: 'Canoeing on the Connecticut River',
    subtitle: 'Hanover, New Hampshire',
    location: 'Hanover, NH, USA',
    category: 'Travel',
  },
  '18.10_roadTest.jpeg': {
    lat: 43.7035,
    lng: -72.2889,
    title: 'Road Test',
    subtitle: 'Hanover, New Hampshire',
    location: 'Hanover, NH, USA',
    category: 'Travel',
  },
  '18.11_stitching.jpeg': {
    lat: 43.7042,
    lng: -72.2897,
    title: 'Lit Pak — Stitching the Prototype',
    subtitle: 'Thayer School of Engineering',
    location: 'Hanover, NH, USA',
    category: 'Education',
  },
  '18.12_cad.png': {
    lat: 43.7048,
    lng: -72.2885,
    title: 'CAD Design at Thayer School',
    subtitle: 'Dartmouth Engineering Exchange',
    location: 'Hanover, NH, USA',
    category: 'Education',
  },
  '18.12_grand_canyon.jpeg': {
    title: 'Strolling through the Grand Canyon with one of my best friends',
    location: 'Grand Canyon National Park, AZ, USA',
    description: 'A winter walk along the South Rim, with the canyon opening up wider at every turn.',
    category: 'Travel',
  },
  '18.12_yosemite.jpeg': {
    title: 'Lone Chapel',
    location: 'Yosemite National Park, CA, USA',
    description: 'Almost died going off-trail in Yosemite',
    category: 'Travel',
  },
  '19.05_hkie.jpeg': {
    lat: 25.0174,
    lng: 121.5396,
    title: 'HKIE Delegation Visit',
    subtitle: 'National Taiwan University',
    location: 'Taipei, Taiwan',
    category: 'Work',
  },
  '20.12_vbrands.jpeg': {
    lat: 22.2800,
    lng: 114.1838,
    date: '2020-12-01',
    title: 'VBrands — Technology Consultant',
    subtitle: 'VBrands',
    location: 'Hong Kong',
    category: 'Work',
  },
  '23.10_icc.jpeg': {
    lat: 22.303725,
    lng: 114.16009,
    title: 'ICC — International Commerce Centre',
    subtitle: 'West Kowloon, Hong Kong',
    location: 'West Kowloon, Hong Kong',
  },
  '23.12_po_toi.jpeg': {
    title: 'Po Toi Island',
    subtitle: 'Hong Kong’s southern edge',
    location: 'Po Toi, Hong Kong',
    description: 'My favorite place to look at the night sky, and second favorite camping spot in Hong Kong',
    category: 'Travel',
  },
  '24.06_milky_way.jpeg': {
    title: 'Plonked my phone on the sunroof and waited inside',
    location: 'Lake Tekapo, New Zealand',
    description: 'While my iPhone did its 30-second exposure',
    category: 'Travel',
  },
  '24.06_tekapo.jpeg': {
    title: 'Lake Tekapo',
    subtitle: 'Church of the Good Shepherd',
    location: 'Lake Tekapo, New Zealand',
    category: 'Travel',
  },
  '25.01_greenland.jpeg': {
    title: 'Greenland',
    subtitle: 'Somewhere over the ice sheet',
    location: 'Greenland',
    category: 'Travel',
  },
  '25.04_atacama.jpeg': {
    title: 'Three layers of Atacama',
    location: 'Atacama Desert, Chile',
    description: 'Visited the Atacama desert (the driest place on Earth) after a rare rain. It was incredible seeing rows of snowy mountains, desert sand, and a moss-covered lake, all in one view',
    category: 'Travel',
  },
  '25.04_easter_island.jpeg': {
    title: 'Ahu Tongariki',
    subtitle: 'Rapa Nui',
    location: 'Easter Island, Chile',
    description: 'A view across the moai at Ahu Tongariki on Easter Island.',
    category: 'Travel',
  },
  '22_icc.jpeg': {
    lat: 22.2796,
    lng: 114.1666,
    title: 'ICC from the Flight Path',
    subtitle: 'Hong Kong reopening after COVID',
    location: 'Hong Kong',
    description: 'A view of ICC while flying out of Hong Kong, with both my office and home visible in the frame.',
    category: 'Work',
  },
  '25.04_torres_del_paine.jpeg': {
    title: 'Torres del Paine',
    subtitle: 'Patagonia',
    location: 'Torres del Paine National Park, Chile',
    description: 'A Patagonia landscape from Torres del Paine National Park.',
    category: 'Travel',
  },
  'leaves.jpeg': {
    lat: 22.4190,
    lng: 114.2075,
    title: 'Simulating Opinion Dynamics in Social Networks',
    subtitle: 'Research · CUHK',
    location: 'Shatin, Hong Kong',
    category: 'Education',
  },
  'litpak.jpeg': {
    lat: 43.7055,
    lng: -72.2901,
    title: 'Lit Pak — Wearable Safety Backpack',
    subtitle: 'Dartmouth Engineering Exchange',
    location: 'Hanover, NH, USA',
    category: 'Education',
  },
  'pilpil.jpeg': {
    title: 'Patagonia',
    subtitle: 'Southern Chile',
    location: 'Patagonia, Chile',
    description: 'A Patagonia travel photograph that currently reuses an older filename.',
    category: 'Travel',
    disableGeneratedPosts: true,
  },
}

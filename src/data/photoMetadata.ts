export type PhotoCategory = 'Education' | 'Work' | 'Travel'

export interface PhotoMetadata {
  lat?: number
  lng?: number
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
  '19.05_hkie.jpeg': {
    lat: 22.3193,
    lng: 114.1694,
    title: 'HKIE Annual Dinner',
    subtitle: 'Hong Kong Institution of Engineers',
    location: 'Kowloon, Hong Kong',
    category: 'Work',
  },
  '20.12_vbrands.jpeg': {
    lat: 22.2800,
    lng: 114.1838,
    title: 'VBrands — Technology Consultant',
    subtitle: 'VBrands',
    location: 'Causeway Bay, Hong Kong',
    category: 'Work',
  },
  '23.10_icc.jpeg': {
    lat: 22.303725,
    lng: 114.16009,
    title: 'ICC — International Commerce Centre',
    subtitle: 'West Kowloon, Hong Kong',
    location: 'West Kowloon, Hong Kong',
    category: 'Travel',
  },
  '25.04_easter_island.jpeg': {
    title: 'Ahu Tongariki at Sunrise',
    subtitle: 'Rapa Nui',
    location: 'Easter Island, Chile',
    description: 'A dawn view across the moai at Ahu Tongariki on Easter Island.',
    category: 'Travel',
  },
  '25.04_hongkong.jpeg': {
    lat: 22.2796,
    lng: 114.1666,
    title: 'Building Software for Equity Risk Management at Morgan Stanley',
    subtitle: 'Morgan Stanley',
    location: 'Central, Hong Kong',
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

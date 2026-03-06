/**
 * photoLocations.ts
 *
 * Merges two data sources into a single PhotoLocation[] for the world map:
 *
 *   1. generatedExif.ts  — auto-generated at build time from image EXIF metadata.
 *      Provides real GPS coordinates (where available), capture dates, and camera info.
 *
 *   2. locationOverrides below — manually maintained.
 *      Supplies coordinates for photos whose GPS was stripped (common when resizing
 *      for web), plus nicer titles, location labels, and post links.
 *
 * Any photo with real EXIF GPS metadata is included on the map automatically.
 * Manual overrides are optional enrichment: they provide better labels and can
 * also supply fallback coordinates when a photo has no embedded GPS.
 *
 * To add a new photo: drop it in public/assets/img/, rebuild (EXIF is re-extracted
 * automatically), then add a matching entry to locationOverrides below.
 */

import { rawExifData } from './generatedExif'

/* ─── Public types ───────────────────────────────────────────────────────── */

export interface PhotoLocation {
  id:             string
  image:          string   // /assets/img/<filename> served from public/assets/img/
  thumbnail:      string   // /assets/img/thumbs/<filename> served from public/assets/img/thumbs/
  lat:            number
  lng:            number
  title:          string
  subtitle?:      string
  location:       string   // Human-readable label shown on the map
  date:           string   // YYYY-MM-DD
  postId?:        string   // Route param for /post/:id (if linked to a post)
  tags?:          string[]
  category?:      string
  locationSource: 'gps' | 'inferred'
  cameraMake?:    string
  cameraModel?:   string
}

/* ─── Manual location overrides ─────────────────────────────────────────── */
/* Coordinates here are used only when the photo has no embedded GPS.        */
/* They are derived from post/experience metadata or well-known landmarks.   */

interface Override {
  lat:       number
  lng:       number
  title:     string
  subtitle?: string
  location:  string
  postId?:   string
  tags?:     string[]
  category?: string
}

const overrides: Record<string, Override> = {
  '15.02_moir.jpeg': {
    lat: 6.8778, lng: 79.8769,
    title: 'Excelling at Elizabeth Moir School',
    subtitle: 'Elizabeth Moir School',
    location: 'Colombo, Sri Lanka',
    postId: '2015-07-31-elizabeth-moir',
    category: 'Education',
    tags: ['A Levels', 'Edexcel', 'Mathematics'],
  },
  '15.07_edexcel.jpeg': {
    lat: 6.9271, lng: 79.8612,
    title: 'A Level Examinations',
    subtitle: 'Edexcel · Sri Lanka',
    location: 'Colombo, Sri Lanka',
    category: 'Education',
    tags: ['A Levels', 'Edexcel'],
  },
  '16.11_graduation.jpeg': {
    lat: 22.4194, lng: 114.2063,
    title: 'Studying Systems Engineering at CUHK',
    subtitle: 'The Chinese University of Hong Kong',
    location: 'Shatin, Hong Kong',
    postId: '2020-06-30-cuhk-systems-engineering',
    category: 'Education',
    tags: ['Systems Engineering', 'CUHK', 'Hong Kong'],
  },
  '17.12_heatmap.png': {
    lat: 22.4196, lng: 114.2060,
    title: 'Restaurant Recommender — Heatmap Analysis',
    subtitle: 'Academic Project · CUHK',
    location: 'Shatin, Hong Kong',
    postId: '2017-12-01-restaurant-recommender',
    category: 'Engineering',
    tags: ['Python', 'Machine Learning', 'Data Visualization'],
  },
  '18.09_window.jpeg': {
    lat: 43.7022, lng: -72.2896,
    title: 'Exchange Semester at Dartmouth College',
    subtitle: 'Dartmouth College',
    location: 'Hanover, NH, USA',
    postId: '2018-12-01-dartmouth-engineering-exchange',
    category: 'Education',
    tags: ['Dartmouth', 'Engineering', 'Exchange'],
  },
  '18.10_canoe.jpeg': {
    lat: 43.6983, lng: -72.3067,
    title: 'Canoeing on the Connecticut River',
    subtitle: 'Hanover, New Hampshire',
    location: 'Hanover, NH, USA',
    category: 'Personal',
    tags: ['Dartmouth', 'Outdoors'],
  },
  '18.10_roadTest.jpeg': {
    lat: 43.7035, lng: -72.2889,
    title: 'Road Test',
    subtitle: 'Hanover, New Hampshire',
    location: 'Hanover, NH, USA',
    category: 'Personal',
    tags: ['Dartmouth'],
  },
  '18.11_stitching.jpeg': {
    lat: 43.7042, lng: -72.2897,
    title: 'Lit Pak — Stitching the Prototype',
    subtitle: 'Thayer School of Engineering',
    location: 'Hanover, NH, USA',
    postId: '2018-12-01-wearable-safety-backpack',
    category: 'Engineering',
    tags: ['Arduino', 'IoT', 'Design'],
  },
  '18.12_cad.png': {
    lat: 43.7048, lng: -72.2885,
    title: 'CAD Design at Thayer School',
    subtitle: 'Dartmouth Engineering Exchange',
    location: 'Hanover, NH, USA',
    postId: '2018-12-01-dartmouth-engineering-exchange',
    category: 'Engineering',
    tags: ['SolidWorks', 'CAD', 'Dartmouth'],
  },
  '19.05_hkie.jpeg': {
    lat: 22.3193, lng: 114.1694,
    title: 'HKIE Annual Dinner',
    subtitle: 'Hong Kong Institution of Engineers',
    location: 'Kowloon, Hong Kong',
    category: 'Work',
    tags: ['Engineering', 'Hong Kong'],
  },
  '20.12_vbrands.jpeg': {
    lat: 22.2800, lng: 114.1838,
    title: 'VBrands — Technology Consultant',
    subtitle: 'VBrands',
    location: 'Causeway Bay, Hong Kong',
    postId: '2020-12-31-vbrands',
    category: 'Work',
    tags: ['Python', 'E-commerce', 'Automation'],
  },
  '23.10_icc.jpeg': {
    // Real GPS in EXIF — these coords used only if EXIF extraction fails
    lat: 22.303725, lng: 114.16009,
    title: 'ICC — International Commerce Centre',
    subtitle: 'West Kowloon, Hong Kong',
    location: 'West Kowloon, Hong Kong',
    category: 'Personal',
    tags: ['Hong Kong', 'Architecture'],
  },
  '25.04_hongkong.jpeg': {
    lat: 22.2796, lng: 114.1666,
    title: 'Building Software for Equity Risk Management at Morgan Stanley',
    subtitle: 'Morgan Stanley',
    location: 'Central, Hong Kong',
    postId: '2025-05-01-morgan-stanley-equity-risk',
    category: 'Work',
    tags: ['Java', 'Kafka', 'KDB+', 'Spring Boot', 'Risk'],
  },
  'leaves.jpeg': {
    lat: 22.4190, lng: 114.2075,
    title: 'Simulating Opinion Dynamics in Social Networks',
    subtitle: 'Research · CUHK',
    location: 'Shatin, Hong Kong',
    postId: '2020-05-31-social-network-opinion-dynamics',
    category: 'Research',
    tags: ['Python', 'NumPy', 'NetworkX', 'Research'],
  },
  'litpak.jpeg': {
    lat: 43.7055, lng: -72.2901,
    title: 'Lit Pak — Wearable Safety Backpack',
    subtitle: 'Dartmouth Engineering Exchange',
    location: 'Hanover, NH, USA',
    postId: '2018-12-01-wearable-safety-backpack',
    category: 'Engineering',
    tags: ['Arduino', 'IoT', 'SolidWorks'],
  },
  'pilpil.jpeg': {
    lat: 22.4478, lng: 114.1684,
    title: 'Restaurant Recommender — Data-Driven Discovery',
    subtitle: 'Open Rice · Tai Po',
    location: 'Tai Po, Hong Kong',
    postId: '2017-12-01-restaurant-recommender',
    category: 'Engineering',
    tags: ['Python', 'Machine Learning', 'Collaborative Filtering'],
  },
}

/* ─── Date helpers ───────────────────────────────────────────────────────── */

/** Parse a date like "YY.MM_..." from the filename prefix. */
function dateFromFilename(filename: string): string {
  const m = filename.match(/^(\d{2})\.(\d{2})_/)
  if (!m) return ''
  return `20${m[1]}-${m[2]}-01`
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, '')
}

function labelFromFilename(filename: string): string {
  const stem = stripExtension(filename)
    .replace(/^\d{2}\.\d{2}_/, '')
    .replace(/[_-]+/g, ' ')
    .trim()

  if (!stem) return 'Untitled Photo'

  return stem.replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatCoordinate(value: number, positive: string, negative: string): string {
  const hemisphere = value >= 0 ? positive : negative
  return `${Math.abs(value).toFixed(4)}° ${hemisphere}`
}

function locationFromCoordinates(lat: number, lng: number): string {
  return `${formatCoordinate(lat, 'N', 'S')}, ${formatCoordinate(lng, 'E', 'W')}`
}

/* ─── Merged export ──────────────────────────────────────────────────────── */

const filenames = Array.from(new Set([
  ...Object.keys(overrides),
  ...Object.entries(rawExifData)
    .filter(([, exif]) => typeof exif.lat === 'number' && typeof exif.lng === 'number')
    .map(([filename]) => filename),
])).sort((a, b) => a.localeCompare(b))

export const photoLocations: PhotoLocation[] = filenames
  .reduce<PhotoLocation[]>((photos, filename) => {
    const ov = overrides[filename]
    const exif = rawExifData[filename] ?? {}
    const hasGPS = typeof exif.lat === 'number' && typeof exif.lng === 'number'

    if (!ov && !hasGPS) return photos

    const lat = hasGPS ? exif.lat! : ov!.lat
    const lng = hasGPS ? exif.lng! : ov!.lng

    photos.push({
      id:             stripExtension(filename),
      image:          `/assets/img/${filename}`,
      thumbnail:      `/assets/img/thumbs/${filename}`,
      lat,
      lng,
      title:          ov?.title ?? labelFromFilename(filename),
      subtitle:       ov?.subtitle,
      location:       ov?.location ?? locationFromCoordinates(lat, lng),
      date:           exif.date ?? dateFromFilename(filename),
      postId:         ov?.postId,
      tags:           ov?.tags,
      category:       ov?.category,
      locationSource: hasGPS ? 'gps' : 'inferred',
      cameraMake:     exif.make,
      cameraModel:    exif.model,
    })

    return photos
  }, [])
  .sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date)
    return a.title.localeCompare(b.title)
  })

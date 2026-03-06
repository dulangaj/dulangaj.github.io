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
 *      for web), plus nicer titles and location labels.
 *
 * Any photo with real EXIF GPS metadata is included on the map automatically.
 * Manual overrides are optional enrichment: they provide better labels and can
 * also supply fallback coordinates when a photo has no embedded GPS.
 *
 * To add a new photo: drop it in public/assets/img/, rebuild (EXIF is re-extracted
 * automatically), then add a matching entry to locationOverrides below.
 */

import { rawExifData } from './generatedExif'
import { generatedPhotoPostLinks, type GeneratedPhotoPostLink } from './generatedPhotoPostLinks'
import { photoMetadata, type PhotoCategory, type PhotoMetadata } from './photoMetadata'

/* ─── Public types ───────────────────────────────────────────────────────── */

export interface PhotoLocation {
  id:             string
  image:          string   // /assets/img/<filename> served from public/assets/img/
  thumbnail:      string   // /assets/img/thumbs/<filename> served from public/assets/img/thumbs/
  lat:            number
  lng:            number
  title:          string
  subtitle?:      string
  description?:   string
  location:       string   // Human-readable label shown on the map
  date:           string   // YYYY-MM-DD
  relatedPosts?:  GeneratedPhotoPostLink[]
  category?:      PhotoCategory
  locationSource: 'gps' | 'inferred'
  cameraMake?:    string
  cameraModel?:   string
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

function relatedPostsFor(filename: string, metadata?: PhotoMetadata): GeneratedPhotoPostLink[] {
  if (metadata?.disableGeneratedPosts) return []
  return [...(generatedPhotoPostLinks[filename] ?? [])]
    .sort((left, right) => right.postId.localeCompare(left.postId))
}

/* ─── Merged export ──────────────────────────────────────────────────────── */

const filenames = Array.from(new Set([
  ...Object.keys(photoMetadata),
  ...Object.entries(rawExifData)
    .filter(([, exif]) => typeof exif.lat === 'number' && typeof exif.lng === 'number')
    .map(([filename]) => filename),
])).sort((a, b) => a.localeCompare(b))

export const photoLocations: PhotoLocation[] = filenames
  .reduce<PhotoLocation[]>((photos, filename) => {
    const metadata = photoMetadata[filename]
    const exif = rawExifData[filename] ?? {}
    const hasGPS = typeof exif.lat === 'number' && typeof exif.lng === 'number'

    if (!metadata && !hasGPS) return photos
    if (!hasGPS && (typeof metadata?.lat !== 'number' || typeof metadata?.lng !== 'number')) return photos

    const lat = hasGPS ? exif.lat! : metadata!.lat!
    const lng = hasGPS ? exif.lng! : metadata!.lng!
    const relatedPosts = relatedPostsFor(filename, metadata)

    photos.push({
      id:             stripExtension(filename),
      image:          `/assets/img/${filename}`,
      thumbnail:      `/assets/img/thumbs/${filename}`,
      lat,
      lng,
      title:          metadata?.title ?? labelFromFilename(filename),
      subtitle:       metadata?.subtitle,
      description:    metadata?.description,
      location:       metadata?.location ?? locationFromCoordinates(lat, lng),
      date:           exif.date ?? dateFromFilename(filename),
      relatedPosts:   relatedPosts.length > 0 ? relatedPosts : undefined,
      category:       metadata?.category,
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

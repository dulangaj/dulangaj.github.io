/**
 * MapPage.tsx
 *
 * Full-screen interactive world map showing all photos pinned to their
 * real-world locations.  Powered by react-leaflet with CartoDB tiles that
 * switch between light and dark to match the site theme.
 *
 * Markers:   circular photo thumbnails with a crimson brand ring.
 * Clusters:  count badge that groups nearby pins (react-leaflet-cluster).
 * Selection: clicking a pin opens a responsive detail view with the full
 *            photo, metadata, and related article links.
 */

import { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiArrowLeft, FiMapPin, FiCalendar, FiBookOpen, FiX, FiCamera, FiArrowUpRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useTheme } from '@/hooks/useTheme'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { photoLocations, type PhotoLocation } from '@/data/photoLocations'

/* ─── Tile layers ────────────────────────────────────────────────────────── */

const TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

const SPIDER_LEG_STYLES = {
  light: {
    color: '#94a3b8',
    opacity: 0.45,
    weight: 1.25,
  },
  dark: {
    color: '#64748b',
    opacity: 0.55,
    weight: 1.25,
  },
} as const

function ThemeAwareTiles() {
  const { isDark } = useTheme()
  const tile = isDark ? TILES.dark : TILES.light
  return (
    <TileLayer
      key={tile.url}
      url={tile.url}
      attribution={tile.attribution}
      minZoom={2}
      maxZoom={5}
      maxNativeZoom={5}
      noWrap={true}
    />
  )
}

/* ─── Zoom controls positioned below the header ─────────────────────────── */

function ZoomControls() {
  const map = useMap()
  useEffect(() => {
    const ctrl = L.control.zoom({ position: 'bottomright' })
    ctrl.addTo(map)
    return () => { ctrl.remove() }
  }, [map])
  return null
}

function ResponsiveMinZoom() {
  const map = useMap()

  useEffect(() => {
    const updateMinZoom = () => {
      const width = map.getSize().x
      const rawMinZoom = Math.log2(width / WORLD_TILE_SIZE)
      const nextMinZoom = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Math.ceil(rawMinZoom)),
      )

      map.setMinZoom(nextMinZoom)

      if (map.getZoom() < nextMinZoom) {
        map.setZoom(nextMinZoom)
      }
    }

    updateMinZoom()
    map.on('resize', updateMinZoom)

    return () => {
      map.off('resize', updateMinZoom)
    }
  }, [map])

  return null
}

function EnsureFreshMapLayout({ onReady }: { onReady: () => void }) {
  const map = useMap()

  useEffect(() => {
    let frameId = 0
    let timeoutId = 0

    const refreshLayout = () => {
      map.invalidateSize(false)
      map.fire('resize')
    }

    refreshLayout()
    frameId = window.requestAnimationFrame(refreshLayout)
    timeoutId = window.setTimeout(() => {
      refreshLayout()
      onReady()
    }, 120)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [map, onReady])

  return null
}
/* ─── Map state in URL ───────────────────────────────────────────────────── */

// Leaflet uses Web Mercator, so the visual midpoint is slightly north of the
// arithmetic latitude average between Colombo and Hong Kong.
const DEFAULT_CENTER: [number, number] = [14.7876, 97.0344]
const DEFAULT_ZOOM = 4
const MIN_ZOOM = 2
const MAX_ZOOM = 5
const MAX_LATITUDE = 85.05112878
const WORLD_BOUNDS: L.LatLngBoundsExpression = [
  [-MAX_LATITUDE, -180],
  [MAX_LATITUDE, 180],
]
const WORLD_TILE_SIZE = 256

function clampLatitude(value: number): number {
  return Math.min(MAX_LATITUDE, Math.max(-MAX_LATITUDE, value))
}

function normalizeLongitude(value: number): number {
  return ((((value + 180) % 360) + 360) % 360) - 180
}

interface MapViewport {
  lat: number
  lng: number
  zoom: number
}

function parseCoordinate(value: string | null, fallback: number): number {
  if (value === null) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseZoom(value: string | null, fallback: number): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, parsed))
}

function isFilterId(value: string | null): value is FilterId {
  return value === 'all' || value === 'linked'
}

function initialPhotoFromId(id: string | null): PhotoLocation | null {
  if (!id) return null
  return photoLocations.find((photo) => photo.id === id) ?? null
}

function MapViewportSync({
  onViewportChange,
}: {
  onViewportChange: (viewport: MapViewport) => void
}) {
  const updateViewport = useCallback((map: L.Map) => {
    const center = map.getCenter()
    onViewportChange({
      lat: clampLatitude(center.lat),
      lng: normalizeLongitude(center.lng),
      zoom: map.getZoom(),
    })
  }, [onViewportChange])

  const map = useMapEvents({
    moveend() {
      updateViewport(map)
    },
    zoomend() {
      updateViewport(map)
    },
  })

  useEffect(() => {
    updateViewport(map)
  }, [map, updateViewport])

  return null
}

/* ─── Custom photo pin marker icon ──────────────────────────────────────── */

class PhotoIconFactory {
  private readonly cache = new Map<string, L.DivIcon>()

  get(photo: PhotoLocation): L.DivIcon {
    const cacheKey = `${photo.id}:${photo.thumbnail}`
    const cached = this.cache.get(cacheKey)

    if (cached) return cached

    const size = 56
    const border = 2.5
    const icon = L.divIcon({
      html: `<div class="map-photo-pin" style="width:${size}px;height:${size}px;border-width:${border}px"><img src="${photo.thumbnail}" alt="" loading="lazy" decoding="async" /></div>`,
      className: '',
      iconSize:   [size, size],
      iconAnchor: [size / 2, size / 2],
    })

    this.cache.set(cacheKey, icon)
    return icon
  }
}

const photoIconFactory = new PhotoIconFactory()

/* ─── Custom cluster icon ────────────────────────────────────────────────── */
/* Shows the most-recent photo in the cluster as a circular thumbnail,       */
/* with a small crimson count badge at the bottom-right — Apple Photos style.*/
/* Photo data is stamped onto each L.Marker via a ref callback (commit phase)*/
/* so it is guaranteed present when addLayer triggers icon creation.         */

interface PhotoMarker extends L.Marker {
  __photo?: PhotoLocation
  _spiderLeg?: L.Polyline
}

interface MarkerClusterLike {
  getChildCount: () => number
  getAllChildMarkers: () => PhotoMarker[]
  spiderfy: () => void
  _icon?: HTMLElement | null
}

interface MarkerClusterGroupWithSpider extends L.FeatureGroup {
  _spiderfied?: MarkerClusterLike | null
  unspiderfy: () => void
}

interface MarkerClusterClickEvent {
  layer?: MarkerClusterLike
}

interface MarkerClusterSpiderfyEvent {
  cluster: MarkerClusterLike
}

interface PhotoSelectionContext {
  photo: PhotoLocation
  clusterPhotos: PhotoLocation[]
}

function spiderfyShapePositions(count: number, center: L.Point): L.Point[] {
  const twoPi = Math.PI * 2

  if (count < 9) {
    const circumference = 50 * (2 + count)
    const legLength = Math.max(circumference / twoPi, 44)
    const angleStep = twoPi / count

    return Array.from({ length: count }, (_, index) => {
      const angle = index * angleStep
      return new L.Point(
        center.x + legLength * Math.cos(angle),
        center.y + legLength * Math.sin(angle),
      ).round()
    })
  }

  const res: L.Point[] = new Array(count)
  let legLength = 22
  let angle = 0

  for (let index = count - 1; index >= 0; index -= 1) {
    angle += 56 / legLength + index * 0.0005
    res[index] = new L.Point(
      center.x + legLength * Math.cos(angle),
      center.y + legLength * Math.sin(angle),
    ).round()
    legLength += twoPi * 5 / angle
  }

  return res
}

function mostRecentPhoto(markers: PhotoMarker[]): PhotoLocation | null {
  let latest: PhotoLocation | null = null

  for (const marker of markers) {
    const photo = marker.__photo
    if (!photo) continue
    if (!latest || photo.date > latest.date) {
      latest = photo
    }
  }

  return latest
}

function photosFromMarkers(markers: PhotoMarker[]): PhotoLocation[] {
  return markers.flatMap((marker) => marker.__photo ? [marker.__photo] : [])
}

class ClusterIconFactory {
  private readonly cache = new Map<string, L.DivIcon>()

  get(count: number, photo: PhotoLocation | null): L.DivIcon {
    const key = photo
      ? `${photo.id}:${photo.thumbnail}:${count}`
      : `fallback:${count}`
    const cached = this.cache.get(key)

    if (cached) return cached

    const size = 60  // same visual weight as individual pins
    const icon = photo
      ? this.createPhotoClusterIcon(count, photo, size)
      : this.createFallbackClusterIcon(count, size)

    this.cache.set(key, icon)
    return icon
  }

  private createFallbackClusterIcon(count: number, size: number): L.DivIcon {
    return L.divIcon({
      html: `<div class="map-cluster-pin map-cluster-pin--fallback" style="width:${size}px;height:${size}px"><span>${count}</span></div>`,
      className: '',
      iconSize:   [size + 10, size + 10],
      iconAnchor: [(size + 10) / 2, (size + 10) / 2],
    })
  }

  private createPhotoClusterIcon(count: number, photo: PhotoLocation, size: number): L.DivIcon {
    const outer = size + 10
    return L.divIcon({
      html: `
      <div class="map-cluster-wrap" style="width:${outer}px;height:${outer}px">
        <div class="map-cluster-photo" style="width:${size}px;height:${size}px">
          <img src="${photo.thumbnail}" alt="" loading="lazy" decoding="async" />
        </div>
        <div class="map-cluster-badge">${count}</div>
      </div>`,
      className: '',
      iconSize:   [outer, outer],
      iconAnchor: [outer / 2, outer / 2],
    })
  }
}

const clusterIconFactory = new ClusterIconFactory()

function createClusterIcon(cluster: MarkerClusterLike) {
  const count = cluster.getChildCount()
  const top = mostRecentPhoto(cluster.getAllChildMarkers())
  return clusterIconFactory.get(count, top)
}

/* ─── Date formatting ────────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      year:  'numeric',
      month: 'long',
    })
  } catch {
    return iso
  }
}

/* ─── Category colour pill ───────────────────────────────────────────────── */

const CATEGORY_COLOURS: Record<string, string> = {
  Work:      'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  Education: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Travel:    'bg-amber-500/15 text-amber-600 dark:text-amber-400',
}

function categoryColour(cat: string | undefined) {
  return cat ? (CATEGORY_COLOURS[cat] ?? 'bg-gray-500/15 text-gray-600') : ''
}

/* ─── Summary stats ──────────────────────────────────────────────────────── */

function countUnique<T>(arr: T[]): number {
  return new Set(arr).size
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'linked', label: 'Articles' },
] as const

type FilterId = typeof FILTER_OPTIONS[number]['id']
const SPIDER_LEG_FADE_MS = 120
const PHOTO_SWIPE_THRESHOLD = 56
const PHOTO_SWIPE_RESTRAINT = 32

const PhotoMarkerClusters = memo(function PhotoMarkerClusters({
  photos,
  onMarkerClick,
}: {
  photos: PhotoLocation[]
  onMarkerClick: (selection: PhotoSelectionContext) => void
}) {
  const { isDark } = useTheme()
  const map = useMap()
  const clusterGroupRef = useRef<MarkerClusterGroupWithSpider | null>(null)
  const collapseTimeoutRef = useRef<number | null>(null)
  const spiderLegPolylineOptions = isDark ? SPIDER_LEG_STYLES.dark : SPIDER_LEG_STYLES.light

  const beginSpiderCollapseVisual = useCallback((cluster: MarkerClusterLike | null | undefined) => {
    if (!cluster) return

    cluster._icon?.classList.remove('map-cluster-icon--spiderfied')
    cluster.getAllChildMarkers().forEach((marker) => {
      marker._spiderLeg?.setStyle({ opacity: 0 })
    })
  }, [])

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current
    if (!clusterGroup) return

    const setSpiderfiedState = (cluster: MarkerClusterLike, spiderfied: boolean) => {
      cluster._icon?.classList.toggle('map-cluster-icon--spiderfied', spiderfied)
    }

    const handleSpiderfied = (event: L.LeafletEvent) => {
      const clusterEvent = event as L.LeafletEvent & MarkerClusterSpiderfyEvent
      setSpiderfiedState(clusterEvent.cluster, true)
    }

    const handleUnspiderfied = (event: L.LeafletEvent) => {
      const clusterEvent = event as L.LeafletEvent & MarkerClusterSpiderfyEvent
      setSpiderfiedState(clusterEvent.cluster, false)
    }

    clusterGroup.on('spiderfied', handleSpiderfied)
    clusterGroup.on('unspiderfied', handleUnspiderfied)

    return () => {
      if (collapseTimeoutRef.current !== null) {
        window.clearTimeout(collapseTimeoutRef.current)
      }
      clusterGroup.off('spiderfied', handleSpiderfied)
      clusterGroup.off('unspiderfied', handleUnspiderfied)
      const spiderfied = clusterGroup._spiderfied
      if (spiderfied) setSpiderfiedState(spiderfied, false)
    }
  }, [])

  useEffect(() => {
    const handleMapCollapseVisual = () => {
      beginSpiderCollapseVisual(clusterGroupRef.current?._spiderfied)
    }

    map.on('click', handleMapCollapseVisual)
    map.on('zoomstart', handleMapCollapseVisual)

    return () => {
      map.off('click', handleMapCollapseVisual)
      map.off('zoomstart', handleMapCollapseVisual)
    }
  }, [beginSpiderCollapseVisual, map])

  const collapseSpiderfiedCluster = useCallback((afterCollapse: () => void) => {
    const clusterGroup = clusterGroupRef.current
    const spiderfied = clusterGroup?._spiderfied

    if (!clusterGroup || !spiderfied) {
      afterCollapse()
      return
    }

    beginSpiderCollapseVisual(spiderfied)

    if (collapseTimeoutRef.current !== null) {
      window.clearTimeout(collapseTimeoutRef.current)
    }

    collapseTimeoutRef.current = window.setTimeout(() => {
      if (clusterGroup._spiderfied === spiderfied) {
        clusterGroup.unspiderfy()
      }
      collapseTimeoutRef.current = null
      afterCollapse()
    }, SPIDER_LEG_FADE_MS)
  }, [beginSpiderCollapseVisual])

  const handleClusterClick = useCallback((event: MarkerClusterClickEvent) => {
    const cluster = event.layer
    if (!cluster) return
    const spiderfied = clusterGroupRef.current?._spiderfied
    if (spiderfied && spiderfied !== cluster) {
      beginSpiderCollapseVisual(spiderfied)
    }
    cluster.spiderfy()
  }, [beginSpiderCollapseVisual])

  const handleMarkerSelect = useCallback((photo: PhotoLocation, marker: PhotoMarker) => {
    const spiderfied = clusterGroupRef.current?._spiderfied
    const selection = {
      photo,
      clusterPhotos: spiderfied && spiderfied.getAllChildMarkers().includes(marker)
        ? photosFromMarkers(spiderfied.getAllChildMarkers())
        : [photo],
    }

    if (spiderfied && !spiderfied.getAllChildMarkers().includes(marker)) {
      collapseSpiderfiedCluster(() => onMarkerClick(selection))
      return
    }
    onMarkerClick(selection)
  }, [collapseSpiderfiedCluster, onMarkerClick])

  return (
    <MarkerClusterGroup
      ref={clusterGroupRef}
      chunkedLoading
      showCoverageOnHover={false}
      maxClusterRadius={80}
      animate={true}
      iconCreateFunction={createClusterIcon}
      zoomToBoundsOnClick={false}
      spiderfyOnMaxZoom={false}
      spiderfyDistanceMultiplier={2}
      spiderfyShapePositions={spiderfyShapePositions}
      spiderLegPolylineOptions={spiderLegPolylineOptions}
      removeOutsideVisibleBounds={true}
      onClick={handleClusterClick}
    >
      {photos.map((photo) => (
        <Marker
          key={photo.id}
          position={[photo.lat, photo.lng]}
          icon={photoIconFactory.get(photo)}
          eventHandlers={{ click: (event) => handleMarkerSelect(photo, event.target as PhotoMarker) }}
          ref={(marker) => { if (marker) (marker as PhotoMarker).__photo = photo }}
        />
      ))}
    </MarkerClusterGroup>
  )
})

/* ─── MapPage ────────────────────────────────────────────────────────────── */

export function MapPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const filterParam = searchParams.get('filter')
  const initialFilter: FilterId = isFilterId(filterParam) ? filterParam : 'all'
  const initialSelected = initialPhotoFromId(searchParams.get('selected'))
  const [selected, setSelected] = useState<PhotoLocation | null>(initialSelected)
  const [selectedClusterPhotoIds, setSelectedClusterPhotoIds] = useState<string[]>(
    initialSelected ? [initialSelected.id] : [],
  )
  const [activeFilter, setActiveFilter] = useState<FilterId>(initialFilter)
  const [isMapLayoutReady, setIsMapLayoutReady] = useState(false)
  const [viewport, setViewport] = useState<MapViewport>({
    lat: clampLatitude(parseCoordinate(searchParams.get('lat'), DEFAULT_CENTER[0])),
    lng: normalizeLongitude(parseCoordinate(searchParams.get('lng'), DEFAULT_CENTER[1])),
    zoom: parseZoom(searchParams.get('z'), DEFAULT_ZOOM),
  })
  const [imageLoaded, setImageLoaded] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const handleMarkerClick = useCallback(({ photo, clusterPhotos }: PhotoSelectionContext) => {
    setImageLoaded(false)
    setSelectedClusterPhotoIds(clusterPhotos.map((clusterPhoto) => clusterPhoto.id))
    setSelected(photo)
  }, [])

  const handleClose = useCallback(() => {
    setImageLoaded(false)
    setSelectedClusterPhotoIds([])
    setSelected(null)
  }, [])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > 100 || info.velocity.y > 500) {
        handleClose()
      }
    },
    [handleClose],
  )

  const navigatePhoto = useCallback((direction: 'prev' | 'next', photos: PhotoLocation[], current: PhotoLocation | null) => {
    if (!current || photos.length === 0) return
    const idx = photos.findIndex((p) => p.id === current.id)
    if (idx === -1) return
    const nextIdx = direction === 'next'
      ? (idx + 1) % photos.length
      : (idx - 1 + photos.length) % photos.length
    setImageLoaded(false)
    setSelected(photos[nextIdx])
  }, [])

  const filteredPhotos = useMemo(() => photoLocations.filter((photo) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'linked') return Boolean(photo.relatedPosts && photo.relatedPosts.length > 0)
    return true
  }), [activeFilter])
  const visibleSelected = selected && filteredPhotos.some((photo) => photo.id === selected.id)
    ? selected
    : null
  const visiblePhotoMap = useMemo(
    () => new Map(filteredPhotos.map((photo) => [photo.id, photo])),
    [filteredPhotos],
  )
  const activeClusterPhotos = useMemo(() => {
    if (!visibleSelected) return []

    const clusterPhotos = selectedClusterPhotoIds
      .map((photoId) => visiblePhotoMap.get(photoId) ?? null)
      .filter((photo): photo is PhotoLocation => photo !== null)

    if (clusterPhotos.some((photo) => photo.id === visibleSelected.id)) {
      return clusterPhotos
    }

    return [visibleSelected]
  }, [selectedClusterPhotoIds, visiblePhotoMap, visibleSelected])
  const canNavigateCluster = activeClusterPhotos.length > 1
  const activeClusterIndex = visibleSelected
    ? activeClusterPhotos.findIndex((photo) => photo.id === visibleSelected.id)
    : -1

  useEffect(() => {
    const nextParams = new URLSearchParams()
    nextParams.set('lat', viewport.lat.toFixed(5))
    nextParams.set('lng', viewport.lng.toFixed(5))
    nextParams.set('z', String(viewport.zoom))

    if (activeFilter !== 'all') {
      nextParams.set('filter', activeFilter)
    }

    if (visibleSelected) {
      nextParams.set('selected', visibleSelected.id)
    }

    if (nextParams.toString() === searchParams.toString()) return
    setSearchParams(nextParams, { replace: true })
  }, [activeFilter, searchParams, setSearchParams, viewport, visibleSelected])

  useEffect(() => {
    if (!selected) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigatePhoto('prev', activeClusterPhotos, selected)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        navigatePhoto('next', activeClusterPhotos, selected)
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'))

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [activeClusterPhotos, handleClose, navigatePhoto, selected])

  const mappedLocations = countUnique(filteredPhotos.map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`))

  return (
    <div
      className="fixed inset-0 z-40"
      style={{ background: 'var(--color-paper)' }}
    >
      {/* ── Header overlay ──────────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-[1000] flex flex-col gap-3 px-4 py-3 sm:px-6"
        style={{
          background:      'color-mix(in srgb, var(--color-paper) 88%, transparent)',
          backdropFilter:  'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom:    '1px solid var(--color-rule)',
        }}
      >
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer bg-transparent border-none"
            aria-label="Back to home"
          >
            <FiArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex-1 min-w-0">
            <h1
              className="font-display text-[15px] font-semibold tracking-tight text-[var(--color-ink)] leading-none"
            >
              My World
            </h1>
            <p className="font-body text-[11px] text-[var(--color-muted)] mt-0.5 leading-none">
              {filteredPhotos.length} visible moments · {mappedLocations} mapped locations
            </p>
          </div>

          <ThemeToggle />
        </div>

        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {FILTER_OPTIONS.map((filter) => {
              const active = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    const nextFilter = filter.id
                    setActiveFilter(nextFilter)
                    if (selected) {
                      const willRemainVisible = photoLocations.some((photo) => {
                        if (photo.id !== selected.id) return false
                        if (nextFilter === 'all') return true
                        return Boolean(photo.relatedPosts && photo.relatedPosts.length > 0)
                      })

                      if (!willRemainVisible) {
                        handleClose()
                      }
                    }
                  }}
                  className="px-3 py-1.5 rounded-full font-body text-[12px] transition-colors duration-200 cursor-pointer"
                  style={{
                    background: active ? 'var(--color-crimson)' : 'var(--color-surface)',
                    color: active ? '#fff' : 'var(--color-muted)',
                    border: `1px solid ${active ? 'var(--color-crimson)' : 'var(--color-rule)'}`,
                  }}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <MapContainer
        center={[viewport.lat, viewport.lng]}
        zoom={viewport.zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={1}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        className="map-container"
      >
        <ThemeAwareTiles />
        <EnsureFreshMapLayout onReady={() => setIsMapLayoutReady(true)} />
        <ZoomControls />
        <ResponsiveMinZoom />
        <MapViewportSync onViewportChange={setViewport} />
        {isMapLayoutReady && (
          <PhotoMarkerClusters
            photos={filteredPhotos}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </MapContainer>

      {/* ── Loading overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isMapLayoutReady && (
          <motion.div
            key="map-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none"
            style={{ background: 'var(--color-paper)' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{
                  borderColor: 'var(--color-rule)',
                  borderTopColor: 'var(--color-crimson)',
                }}
              />
              <span
                className="font-body text-[12px]"
                style={{ color: 'var(--color-muted)' }}
              >
                Loading map…
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom sheet ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {visibleSelected && (
          <>
            {/* Scrim — tap to close */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[1001] bg-black/25 lg:bg-transparent"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.8 }}
              drag={isDesktop ? false : 'y'}
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute bottom-0 left-0 right-0 z-[1002] max-h-[85vh] flex flex-col rounded-t-2xl overflow-hidden shadow-2xl lg:top-24 lg:right-6 lg:left-auto lg:w-[min(440px,38vw)] lg:max-h-[calc(100vh-7rem)] lg:rounded-2xl"
              style={{
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-rule)',
                borderLeft: '1px solid var(--color-rule)',
                borderRight: '1px solid var(--color-rule)',
                borderBottom: '1px solid var(--color-rule)',
              }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`map-photo-title-${visibleSelected.id}`}
              ref={panelRef}
            >
              <div
                className="relative flex items-center justify-center px-4 pt-3 pb-2 flex-shrink-0 border-b border-[var(--color-rule)]"
                style={{ touchAction: 'none' }}
              >
                <div className="w-9 h-1 rounded-full lg:hidden" style={{ background: 'var(--color-rule)' }} />

                {/* Photo navigation */}
                {isDesktop && canNavigateCluster && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 z-10">
                    <button
                      onClick={() => navigatePhoto('prev', activeClusterPhotos, visibleSelected)}
                      className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border-none transition-colors duration-200"
                      style={{ background: 'var(--color-paper)', color: 'var(--color-muted)' }}
                      aria-label="Previous photo"
                      aria-keyshortcuts="ArrowLeft"
                    >
                      <FiChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => navigatePhoto('next', activeClusterPhotos, visibleSelected)}
                      className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border-none transition-colors duration-200"
                      style={{ background: 'var(--color-paper)', color: 'var(--color-muted)' }}
                      aria-label="Next photo"
                      aria-keyshortcuts="ArrowRight"
                    >
                      <FiChevronRight size={15} />
                    </button>
                  </div>
                )}

                {canNavigateCluster && activeClusterIndex !== -1 && (
                  <div
                    className="font-mono text-[10px] tracking-[0.14em] uppercase"
                    style={{ color: 'var(--color-subtle)' }}
                  >
                    {activeClusterIndex + 1} / {activeClusterPhotos.length}
                  </div>
                )}

                <button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  className="absolute right-3 top-3 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border-none transition-colors duration-200 z-10"
                  style={{ background: 'var(--color-paper)', color: 'var(--color-muted)' }}
                  aria-label="Close"
                  aria-keyshortcuts="Escape"
                >
                  <FiX size={15} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto overscroll-contain">
                {/* Photo */}
                <motion.div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '16/9', background: 'var(--color-rule)' }}
                  drag={canNavigateCluster && !isDesktop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.14}
                  dragMomentum={false}
                  onDragEnd={(_, info) => {
                    if (!canNavigateCluster) return
                    const isHorizontalSwipe = Math.abs(info.offset.x) > Math.abs(info.offset.y) + PHOTO_SWIPE_RESTRAINT
                    if (!isHorizontalSwipe) return
                    if (info.offset.x <= -PHOTO_SWIPE_THRESHOLD || info.velocity.x <= -500) {
                      navigatePhoto('next', activeClusterPhotos, visibleSelected)
                      return
                    }
                    if (info.offset.x >= PHOTO_SWIPE_THRESHOLD || info.velocity.x >= 500) {
                      navigatePhoto('prev', activeClusterPhotos, visibleSelected)
                    }
                  }}
                >
                  <img
                    src={visibleSelected.thumbnail}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/8" />
                  {!imageLoaded && (
                    <div
                      className="absolute inset-0 animate-pulse"
                      style={{ background: 'color-mix(in srgb, var(--color-rule) 78%, transparent)' }}
                    />
                  )}
                  <img
                    src={visibleSelected.image}
                    alt={visibleSelected.title}
                    className="relative z-[1] w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                    onLoad={() => setImageLoaded(true)}
                  />

                  {/* Camera badge */}
                  {visibleSelected.cameraModel && (
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-medium"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      <FiCamera size={9} />
                      {visibleSelected.cameraModel}
                    </div>
                  )}
                </motion.div>

                {/* Info */}
                <div className="px-5 pt-4 pb-6">
                  {/* Category + location */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {visibleSelected.category && (
                      <span
                        className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColour(visibleSelected.category)}`}
                      >
                        {visibleSelected.category}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1 font-body text-[12px]"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      <FiMapPin size={11} />
                      {visibleSelected.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    id={`map-photo-title-${visibleSelected.id}`}
                    className="font-display text-[20px] sm:text-[22px] font-semibold leading-snug mb-1"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    {visibleSelected.title}
                  </h2>

                  {/* Subtitle */}
                  {visibleSelected.subtitle && (
                    <p
                      className="font-body text-[13px] mb-3"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {visibleSelected.subtitle}
                    </p>
                  )}

                  {visibleSelected.description && (
                    <p
                      className="font-body text-[13px] leading-relaxed mb-4"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {visibleSelected.description}
                    </p>
                  )}

                  {/* Date */}
                  {visibleSelected.date && (
                    <div
                      className="flex items-center gap-1.5 font-body text-[12px] mb-4"
                      style={{ color: 'var(--color-subtle)' }}
                    >
                      <FiCalendar size={11} />
                      {formatDate(visibleSelected.date)}
                    </div>
                  )}

                  {/* Related posts */}
                  {visibleSelected.relatedPosts && visibleSelected.relatedPosts.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p
                        className="font-mono text-[10px] tracking-[0.18em] uppercase"
                        style={{ color: 'var(--color-subtle)' }}
                      >
                        {visibleSelected.relatedPosts.length === 1 ? 'Related Article' : 'Related Articles'}
                      </p>
                      {visibleSelected.relatedPosts.map((post) => (
                        <button
                          key={post.postId}
                          onClick={() => navigate(`/post/${post.postId}`, {
                            state: {
                              backTo: `${location.pathname}${location.search}`,
                              backLabel: 'Back to map',
                            },
                          })}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-body text-[13px] font-medium transition-all duration-200 cursor-pointer"
                          style={{
                            background: 'var(--color-paper)',
                            color:      'var(--color-ink)',
                            border:     '1px solid var(--color-rule)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--color-surface)'
                            e.currentTarget.style.borderColor = 'var(--color-crimson)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--color-paper)'
                            e.currentTarget.style.borderColor = 'var(--color-rule)'
                          }}
                        >
                          <span
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'color-mix(in srgb, var(--color-crimson) 12%, transparent)', color: 'var(--color-crimson)' }}
                          >
                            <FiBookOpen size={14} />
                          </span>
                          <span className="flex-1 text-left">{post.title}</span>
                          <FiArrowUpRight size={14} style={{ color: 'var(--color-subtle)' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Keyboard shortcut hints — desktop only */}
              <div
                className="hidden lg:flex items-center justify-center gap-4 px-4 py-2 flex-shrink-0 border-t border-[var(--color-rule)]"
              >
                {canNavigateCluster && (
                  <span
                    className="flex items-center gap-1.5 font-mono text-[10px]"
                    style={{ color: 'var(--color-subtle)' }}
                  >
                    <kbd
                      className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px]"
                      style={{ background: 'var(--color-paper)', border: '1px solid var(--color-rule)' }}
                    >
                      ←
                    </kbd>
                    <kbd
                      className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px]"
                      style={{ background: 'var(--color-paper)', border: '1px solid var(--color-rule)' }}
                    >
                      →
                    </kbd>
                    navigate
                  </span>
                )}
                <span
                  className="flex items-center gap-1.5 font-mono text-[10px]"
                  style={{ color: 'var(--color-subtle)' }}
                >
                  <kbd
                    className="inline-flex items-center justify-center px-1.5 h-5 rounded text-[10px]"
                    style={{ background: 'var(--color-paper)', border: '1px solid var(--color-rule)' }}
                  >
                    esc
                  </kbd>
                  close
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

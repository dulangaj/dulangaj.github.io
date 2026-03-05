/**
 * MapPage.tsx
 *
 * Full-screen interactive world map showing all photos pinned to their
 * real-world locations.  Powered by react-leaflet with CartoDB tiles that
 * switch between light and dark to match the site theme.
 *
 * Markers:   circular photo thumbnails with a crimson brand ring.
 * Clusters:  count badge that groups nearby pins (react-leaflet-cluster).
 * Selection: clicking a pin slides up a Framer Motion bottom sheet with
 *            the full photo, metadata, and a link to the associated post.
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FiArrowLeft, FiMapPin, FiCalendar, FiBookOpen, FiX, FiCamera } from 'react-icons/fi'
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

function ThemeAwareTiles() {
  const { isDark } = useTheme()
  const tile = isDark ? TILES.dark : TILES.light
  return (
    <TileLayer
      key={tile.url}
      url={tile.url}
      attribution={tile.attribution}
      maxZoom={19}
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

/* ─── Fit map to show all pins on first load ─────────────────────────────── */

function FitBounds({ locations }: { locations: PhotoLocation[] }) {
  const map = useMap()
  const fitted = useRef(false)
  useEffect(() => {
    if (fitted.current || locations.length === 0) return
    fitted.current = true
    const bounds = L.latLngBounds(locations.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 10 })
  }, [map, locations])
  return null
}

/* ─── Custom photo pin marker icon ──────────────────────────────────────── */

function createPhotoIcon(photo: PhotoLocation, selected = false) {
  const size = selected ? 60 : 50
  const border = selected ? 3 : 2.5
  return L.divIcon({
    html: `<div class="map-photo-pin${selected ? ' map-photo-pin--selected' : ''}" style="width:${size}px;height:${size}px;border-width:${border}px"><img src="${photo.image}" alt="" loading="lazy" /></div>`,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

/* ─── Custom cluster icon ────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount()
  const size  = count < 10 ? 44 : count < 100 ? 50 : 56
  return L.divIcon({
    html: `<div class="map-cluster-pin" style="width:${size}px;height:${size}px"><span>${count}</span></div>`,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  })
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
  Work:        'bg-blue-500/15  text-blue-600  dark:text-blue-400',
  Education:   'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  Engineering: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  Research:    'bg-amber-500/15  text-amber-600  dark:text-amber-400',
  Personal:    'bg-rose-500/15   text-rose-600   dark:text-rose-400',
}

function categoryColour(cat: string | undefined) {
  return cat ? (CATEGORY_COLOURS[cat] ?? 'bg-gray-500/15 text-gray-600') : ''
}

/* ─── Summary stats ──────────────────────────────────────────────────────── */

function countUnique<T>(arr: T[]): number {
  return new Set(arr).size
}

/* ─── MapPage ────────────────────────────────────────────────────────────── */

export function MapPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<PhotoLocation | null>(null)

  const handleMarkerClick = useCallback((photo: PhotoLocation) => {
    setSelected(photo)
  }, [])

  const handleClose = useCallback(() => setSelected(null), [])

  // Close bottom sheet on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose])

  const countries = countUnique(photoLocations.map((p) => p.location.split(', ').at(-1) ?? ''))
  const cities    = countUnique(photoLocations.map((p) => p.location.split(', ')[0]))

  return (
    <div
      className="fixed inset-0 z-40"
      style={{ background: 'var(--color-paper)' }}
    >
      {/* ── Header overlay ──────────────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-[1000] flex items-center gap-4 px-6 py-3"
        style={{
          background:      'color-mix(in srgb, var(--color-paper) 88%, transparent)',
          backdropFilter:  'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom:    '1px solid var(--color-rule)',
        }}
      >
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer bg-transparent border-none"
          aria-label="Back to home"
        >
          <FiArrowLeft size={15} />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1
            className="font-display text-[15px] font-semibold tracking-tight text-[var(--color-ink)] leading-none"
          >
            My World
          </h1>
          <p className="font-body text-[11px] text-[var(--color-muted)] mt-0.5 leading-none">
            {photoLocations.length} moments · {cities} cities · {countries} countries
          </p>
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <MapContainer
        center={[25, 60]}
        zoom={3}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        className="map-container"
      >
        <ThemeAwareTiles />
        <ZoomControls />
        <FitBounds locations={photoLocations} />

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={55}
          animate={true}
          createClusterCustomIcon={createClusterIcon}
          spiderfyOnMaxZoom={true}
          removeOutsideVisibleBounds={true}
        >
          {photoLocations.map((photo) => (
            <Marker
              key={photo.id}
              position={[photo.lat, photo.lng]}
              icon={createPhotoIcon(photo, selected?.id === photo.id)}
              eventHandlers={{ click: () => handleMarkerClick(photo) }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* ── Bottom sheet ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Scrim — tap to close */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[1001]"
              style={{ background: 'rgba(0,0,0,0.25)' }}
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.8 }}
              className="absolute bottom-0 left-0 right-0 z-[1002] max-h-[85vh] flex flex-col rounded-t-2xl overflow-hidden shadow-2xl"
              style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-rule)' }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label={selected.title}
            >
              {/* Drag pill */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div
                  className="w-9 h-1 rounded-full"
                  style={{ background: 'var(--color-rule)' }}
                />
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto overscroll-contain">
                {/* Photo */}
                <div className="relative w-full" style={{ aspectRatio: '16/9', background: 'var(--color-rule)' }}>
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />

                  {/* GPS badge */}
                  {selected.locationSource === 'gps' && (
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-medium text-white"
                      style={{ background: 'rgba(220,38,38,0.85)', backdropFilter: 'blur(8px)' }}
                    >
                      <FiMapPin size={9} />
                      GPS
                    </div>
                  )}

                  {/* Camera badge */}
                  {selected.cameraModel && (
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full font-body text-[10px] font-medium"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      <FiCamera size={9} />
                      {selected.cameraModel}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="px-5 pt-4 pb-6">
                  {/* Category + location */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {selected.category && (
                      <span
                        className={`font-body text-[11px] font-medium px-2 py-0.5 rounded-full ${categoryColour(selected.category)}`}
                      >
                        {selected.category}
                      </span>
                    )}
                    <span
                      className="flex items-center gap-1 font-body text-[12px]"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      <FiMapPin size={11} />
                      {selected.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-display text-[20px] sm:text-[22px] font-semibold leading-snug mb-1"
                    style={{ color: 'var(--color-ink)' }}
                  >
                    {selected.title}
                  </h2>

                  {/* Subtitle */}
                  {selected.subtitle && (
                    <p
                      className="font-body text-[13px] mb-3"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      {selected.subtitle}
                    </p>
                  )}

                  {/* Date */}
                  {selected.date && (
                    <div
                      className="flex items-center gap-1.5 font-body text-[12px] mb-4"
                      style={{ color: 'var(--color-subtle)' }}
                    >
                      <FiCalendar size={11} />
                      {formatDate(selected.date)}
                    </div>
                  )}

                  {/* Tags */}
                  {selected.tags && selected.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {selected.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] px-2 py-0.5 rounded"
                          style={{
                            background: 'var(--color-paper)',
                            color:      'var(--color-muted)',
                            border:     '1px solid var(--color-rule)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read post CTA */}
                  {selected.postId && (
                    <button
                      onClick={() => navigate(`/post/${selected.postId}`)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body text-[13px] font-medium transition-all duration-200 cursor-pointer border-none"
                      style={{
                        background: 'var(--color-crimson)',
                        color:      '#fff',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-crimson-hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-crimson)'
                      }}
                    >
                      <FiBookOpen size={14} />
                      Read Post
                    </button>
                  )}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer border-none transition-colors duration-200 z-10"
                style={{ background: 'var(--color-paper)', color: 'var(--color-muted)' }}
                aria-label="Close"
              >
                <FiX size={15} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

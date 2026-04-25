import { Component, lazy, Suspense, useEffect, type ErrorInfo, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header }     from '@/components/layout/Header'
import { Footer }     from '@/components/layout/Footer'
import { Hero }       from '@/components/sections/Hero'
import { NowStrip }   from '@/components/ui/NowStrip'
import { Featured }   from '@/components/sections/Featured'
import { Experience } from '@/components/sections/Experience'
import { Writing }    from '@/components/sections/Writing'
import { homeSections } from '@/data/homeSections'
import { PostDetail } from '@/pages/PostDetail'
import { WritingPage } from '@/pages/WritingPage'

const MapPage = lazy(async () => {
  const module = await import('@/pages/MapPage')
  return { default: module.MapPage }
})

const SITE_URL = 'https://dulangaj.com'
const OG_IMAGE = `${SITE_URL}/assets/social/og-home.png`

const HOME_METADATA = {
  title: 'Dulanga Jayawardena | Software Engineer',
  description: 'Software engineer building production-grade systems for financial markets across risk technology, analytics, and infrastructure.',
  canonical: `${SITE_URL}/`,
}

const MAP_METADATA = {
  title: 'My World Map | Dulanga Jayawardena',
  description: 'Interactive world photo map tracing Dulanga Jayawardena’s travels, photography, and related writing.',
  canonical: `${SITE_URL}/map`,
}

const WRITING_METADATA = {
  title: 'Writing Archive | Dulanga Jayawardena',
  description: 'Index of articles, project notes, and engineering write-ups by Dulanga Jayawardena.',
  canonical: `${SITE_URL}/writing/`,
}

function applyDocumentMetadata({ title, description, canonical }: typeof HOME_METADATA) {
  if (typeof document === 'undefined') return

  const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  const ogTypeMeta = document.querySelector<HTMLMetaElement>('meta[property="og:type"]')
  const ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
  const ogTitleMeta = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
  const ogDescriptionMeta = document.querySelector<HTMLMetaElement>('meta[property="og:description"]')
  const ogImageMeta = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
  const ogImageSecureMeta = document.querySelector<HTMLMetaElement>('meta[property="og:image:secure_url"]')
  const twitterTitleMeta = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
  const twitterDescriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
  const twitterImageMeta = document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]')
  const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  document.title = title
  if (descriptionMeta) descriptionMeta.content = description
  if (ogTypeMeta) ogTypeMeta.content = 'website'
  if (ogUrlMeta) ogUrlMeta.content = canonical
  if (ogTitleMeta) ogTitleMeta.content = title
  if (ogDescriptionMeta) ogDescriptionMeta.content = description
  if (ogImageMeta) ogImageMeta.content = OG_IMAGE
  if (ogImageSecureMeta) ogImageSecureMeta.content = OG_IMAGE
  if (twitterTitleMeta) twitterTitleMeta.content = title
  if (twitterDescriptionMeta) twitterDescriptionMeta.content = description
  if (twitterImageMeta) twitterImageMeta.content = OG_IMAGE
  if (canonicalLink) canonicalLink.href = canonical
}

function isPostRoute(pathname: string): boolean {
  if (pathname === '/' || pathname === '') return false
  if (pathname === '/map' || pathname === '/map/') return false
  if (pathname === '/writing' || pathname === '/writing/') return false
  return true
}

/* ─── App ────────────────────────────────────────────────────────────────── */

function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content">
        {homeSections.hero && <Hero />}
        {homeSections.now && <NowStrip />}
        {homeSections.featured && <Featured />}
        {homeSections.experience && <Experience />}
        {homeSections.writing && <Writing />}
      </main>
      <Footer />
    </>
  )
}

interface RouteErrorBoundaryProps {
  children: ReactNode
  resetKey: string
}

interface RouteErrorBoundaryState {
  hasError: boolean
}

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route rendering failed.', error, errorInfo)
  }

  componentDidUpdate(prevProps: RouteErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-6">
          <div className="flex max-w-sm flex-col items-center gap-4 text-center">
            <div className="h-px w-10 bg-[var(--color-crimson)]" aria-hidden="true" />
            <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-subtle)]">
              Site failed to load
            </p>
            <p className="text-sm leading-6 text-[var(--color-muted)]">
              Refresh and try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-crimson)] transition-colors hover:text-[var(--color-crimson-hover)]"
            >
              Reload
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.dispatchEvent(new Event('app:mounted'))
  }, [])

  useEffect(() => {
    const path = location.pathname
    if (isPostRoute(path)) return

    if (path === '/map' || path === '/map/') {
      applyDocumentMetadata(MAP_METADATA)
    } else if (path === '/writing' || path === '/writing/') {
      applyDocumentMetadata(WRITING_METADATA)
    } else {
      applyDocumentMetadata(HOME_METADATA)
    }
  }, [location.pathname])

  const resetKey = location.key || `${location.pathname}${location.search}${location.hash}`

  return (
    <RouteErrorBoundary resetKey={resetKey}>
      <Suspense fallback={
        <main className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-px w-10 bg-[var(--color-crimson)] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-subtle)]">
              Loading
            </span>
          </div>
        </main>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/:slug" element={<PostDetail />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  )
}

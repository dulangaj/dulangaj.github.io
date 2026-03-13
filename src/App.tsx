import { Component, lazy, Suspense, useEffect, type ErrorInfo, type ReactNode } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header }     from '@/components/layout/Header'
import { Footer }     from '@/components/layout/Footer'
import { Hero }       from '@/components/sections/Hero'
import { NowStrip }   from '@/components/ui/NowStrip'
import { Featured }   from '@/components/sections/Featured'
import { Experience } from '@/components/sections/Experience'
import { Writing }    from '@/components/sections/Writing'
import { Skills }     from '@/components/sections/Skills'
import { homeSections } from '@/data/homeSections'

const PostDetail = lazy(async () => {
  const module = await import('@/pages/PostDetail')
  return { default: module.PostDetail }
})

const MapPage = lazy(async () => {
  const module = await import('@/pages/MapPage')
  return { default: module.MapPage }
})

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
        {homeSections.skills && <Skills />}
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

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    window.dispatchEvent(new Event('app:mounted'))
  }, [])

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
          <Route path="/"         element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/map"      element={<MapPage />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}

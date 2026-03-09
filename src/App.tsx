import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Header }     from '@/components/layout/Header'
import { Footer }     from '@/components/layout/Footer'
import { Hero }       from '@/components/sections/Hero'
import { NowStrip }   from '@/components/ui/NowStrip'
import { Featured }   from '@/components/sections/Featured'
import { Experience } from '@/components/sections/Experience'
import { Writing }    from '@/components/sections/Writing'
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
        {homeSections.writing && <Writing />}
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
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
    </HashRouter>
  )
}

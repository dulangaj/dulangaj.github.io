import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Header }     from '@/components/layout/Header'
import { Footer }     from '@/components/layout/Footer'
import { Hero }       from '@/components/sections/Hero'
import { Projects }   from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Writing }    from '@/components/sections/Writing'

const PostDetail = lazy(async () => {
  const module = await import('@/pages/PostDetail')
  return { default: module.PostDetail }
})

/* ─── App ────────────────────────────────────────────────────────────────── */

function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <Projects />
        <Experience />
        <Writing />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<main className="min-h-screen pt-24 px-6 md:px-12" />}>
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

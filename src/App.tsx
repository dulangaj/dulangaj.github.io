import { HashRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence }                                            from 'framer-motion'
import { Header }          from '@/components/layout/Header'
import { Footer }          from '@/components/layout/Footer'
import { Hero }            from '@/components/sections/Hero'
import { Projects }        from '@/components/sections/Projects'
import { Experience }      from '@/components/sections/Experience'
import { Writing }         from '@/components/sections/Writing'
import { PostDetail }      from '@/pages/PostDetail'
import { PageTransition, type NavDirection } from '@/components/layout/PageTransition'

/* ─── Pages ──────────────────────────────────────────────────────────────── */

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Writing />
      </main>
      <Footer />
    </>
  )
}

/* ─── Animated route switcher (must live inside HashRouter for hooks) ─────── */

function AnimatedRoutes() {
  const location  = useLocation()
  const navType   = useNavigationType()
  const direction: NavDirection = navType === 'POP' ? 'back' : 'forward'

  return (
    // custom keeps the direction value accessible to the exiting page's exit variant
    <AnimatePresence mode="wait" custom={direction}>
      <PageTransition key={location.pathname} direction={direction}>
        <Routes location={location}>
          <Route path="/"         element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────── */

export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  )
}

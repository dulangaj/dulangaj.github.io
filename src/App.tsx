import { HashRouter, Routes, Route } from 'react-router-dom'
import { Header }     from '@/components/layout/Header'
import { Footer }     from '@/components/layout/Footer'
import { Hero }       from '@/components/sections/Hero'
import { Projects }   from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Writing }    from '@/components/sections/Writing'
import { PostDetail } from '@/pages/PostDetail'

/* ─── App ────────────────────────────────────────────────────────────────── */

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

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </HashRouter>
  )
}

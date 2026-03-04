import { Header }     from '@/components/layout/Header'
import { Footer }     from '@/components/layout/Footer'
import { Hero }       from '@/components/sections/Hero'
import { Projects }   from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Writing }    from '@/components/sections/Writing'

/* ─── App ────────────────────────────────────────────────────────────────── */
/* Root component. Composes the full single-page layout.                     */

export default function App() {
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

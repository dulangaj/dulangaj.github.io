import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── NotFoundPage ───────────────────────────────────────────────────────── */
/* Any unknown path. Prerendered to dist/404.html for GitHub Pages, so it     */
/* must not depend on the requested URL or the hydrated tree would differ.    */

const notFound = SiteConfig.paper.article.notFound
const [home, writing] = SiteConfig.paper.nav.links
const linkClass =
  'inline-flex items-center min-h-11 px-2 font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-muted)] hover:text-[var(--color-crimson)] transition-colors duration-200'

export function NotFoundPage() {
  useEffect(() => {
    document.title = `${notFound.headline.replace(/\.$/, '')} | ${SiteConfig.name}`
  }, [])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[var(--color-crimson)] mb-4">
            {notFound.kicker}
          </p>
          <h1 className="font-display text-4xl text-[var(--color-ink)] mb-6">
            {notFound.headline}
          </h1>
          <p className="flex flex-wrap items-center justify-center">
            <Link to={home.to} className={linkClass}>{home.label}</Link>
            <span aria-hidden="true" className="text-[var(--color-subtle)]">·</span>
            <Link to={writing.to} className={linkClass}>{writing.label}</Link>
            <span aria-hidden="true" className="text-[var(--color-subtle)]">·</span>
            <a href={SiteConfig.mailtoLink} className={linkClass}>{notFound.email}</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { SiteConfig } from '@/models/SiteConfig'
import { EditionToggle } from '@/components/ui/EditionToggle'

/* ─── Header ─────────────────────────────────────────────────────────────── */
/* Slim fixed utility strip: wordmark left, edition toggle right. Navigation  */
/* is the front page's job — the "Inside this Issue" index — so this bar only */
/* carries the reader back to the top. On the homepage it stays hidden while  */
/* the masthead is in view (nothing sits above a nameplate) and slides in     */
/* once the reader scrolls; subpages have no masthead, so it is always shown. */

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const visible = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const returnToTop = () => {
    if (location.pathname !== '/') {
      navigate('/')
      return
    }

    window.dispatchEvent(new CustomEvent('site:navigation-scroll-start'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('site:navigation-scroll-end'))
    }, 900)
  }

  return (
    <motion.header
      className="site-header fixed top-0 inset-x-0 z-50"
      style={{ backgroundColor: 'var(--color-paper)', pointerEvents: visible ? 'auto' : 'none' }}
      inert={!visible}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : -16,
        borderBottomColor: scrolled ? 'var(--color-rule)' : 'transparent',
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between"
        style={{
          height: '64px',
          borderBottom: scrolled ? '1px solid var(--color-rule)' : '1px solid transparent',
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Wordmark */}
        <a
          href="/"
          className="font-display text-[15px] font-semibold tracking-tight text-[var(--color-ink)] hover:text-[var(--color-crimson)] transition-colors duration-200"
          onClick={(event) => {
            event.preventDefault()
            returnToTop()
          }}
        >
          {SiteConfig.initials}
          <span className="text-[var(--color-crimson)]">.</span>
        </a>

        <EditionToggle />
      </div>

      {/* Printed triple rule — thick / hairline — appears once the reader scrolls */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-7px] left-0 right-0 pointer-events-none"
        style={{ opacity: scrolled ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div className="h-[2px] bg-[var(--color-ink)]" />
        <div className="h-[1px] mt-[2px] bg-[var(--color-ink)]" />
      </div>
    </motion.header>
  )
}

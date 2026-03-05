import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SiteConfig } from '@/models/SiteConfig'
import { useScrollProgress } from '@/hooks/useScrollProgress'

/* ─── Header ─────────────────────────────────────────────────────────────── */
/* Fixed top bar: logo/initials left, nav right. Fades in border on scroll. */
/* Crimson scroll-progress bar runs along the bottom edge of the header.    */

export function Header() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const scrollProgress = useScrollProgress()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  return (
    <motion.header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{ backgroundColor: 'var(--color-paper)' }}
      animate={{ borderBottomColor: scrolled ? 'var(--color-rule)' : 'transparent' }}
      transition={{ duration: 0.3 }}
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
          href="#top"
          className="font-display text-[15px] font-semibold tracking-tight text-[var(--color-ink)] hover:text-[var(--color-crimson)] transition-colors duration-200"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {SiteConfig.initials}
          <span className="text-[var(--color-crimson)]">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {SiteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-[13px] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200 tracking-wide cursor-pointer bg-transparent border-none"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <motion.span
            className="block w-5 h-px bg-[var(--color-ink)]"
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
          />
          <motion.span
            className="block w-5 h-px bg-[var(--color-ink)]"
            animate={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <motion.span
            className="block w-5 h-px bg-[var(--color-ink)]"
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="md:hidden overflow-hidden bg-[var(--color-paper)] border-b border-[var(--color-rule)]"
          >
            <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
              {SiteConfig.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-left font-body text-[15px] text-[var(--color-ink)] hover:text-[var(--color-crimson)] transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Scroll progress bar — runs along the very bottom edge of the header */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-crimson)] origin-left"
        style={{ scaleX: scrollProgress }}
        transition={{ duration: 0 }}
      />
    </motion.header>
  )
}

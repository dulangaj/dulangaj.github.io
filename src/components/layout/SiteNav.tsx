import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { SiteConfig } from '@/models/SiteConfig'

/* ─── SiteNav ────────────────────────────────────────────────────────────── */
/* The running head's section index: Home · Writing · Photos, set in the     */
/* utility face. Shared by the fixed header and the map's own header.         */

const nav = SiteConfig.paper.nav

export function SiteNav() {
  return (
    <nav aria-label={nav.label}>
      <ul className="m-0 p-0 list-none flex items-center font-mono text-[10px] tracking-[0.18em] uppercase">
        {nav.links.map((link, index) => (
          <Fragment key={link.to}>
            {index > 0 && (
              <li aria-hidden="true" className="text-[var(--color-subtle)]">·</li>
            )}
            <li>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  `inline-flex items-center min-h-11 px-1.5 transition-colors duration-200 hover:text-[var(--color-crimson)] ${
                    isActive ? 'text-[var(--color-crimson)]' : 'text-[var(--color-muted)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          </Fragment>
        ))}
      </ul>
    </nav>
  )
}

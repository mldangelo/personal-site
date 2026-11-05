'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import routes from '@/data/routes';
import { isActiveRoute } from '@/lib/routes';
import { smartQuotes } from '@/lib/typography';
import { AUTHOR_NAME } from '@/lib/utils';

import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

/**
 * Every address the homepage document is served at. GitHub Pages answers
 * `/index` and `/index.html` with the same file as `/`, and `usePathname`
 * reports the address bar, not the route that was prerendered. Asking only for
 * `/` would put the name where that file's HTML has the monogram, which React
 * treats as a hydration error.
 */
const HOME_PATHS = new Set(['/', '/index', '/index.html']);

export default function Navigation() {
  const pathname = usePathname();
  // The hero sets the name at display size directly under the header, so the
  // homepage keeps the monogram. Every other page shows the name itself.
  const home = HOME_PATHS.has(pathname);

  return (
    <header className="site-header">
      <div className="site-brand">
        <Link
          href="/"
          className={home ? 'site-logo' : 'site-logo site-logo--name'}
          aria-label={`${AUTHOR_NAME} — home`}
        >
          <span className="logo-text">
            {home ? 'md' : smartQuotes(AUTHOR_NAME)}
          </span>
        </Link>
      </div>

      <nav className="nav-links" aria-label="Primary">
        {routes
          .filter((l) => !l.index && l.primary !== false)
          .map((l) => {
            const active = isActiveRoute(pathname, l.path);

            return (
              <Link
                key={l.label}
                href={l.path}
                className={`nav-link ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {l.label}
              </Link>
            );
          })}
      </nav>

      <div className="nav-actions">
        <ThemeToggle />
        <Hamburger />
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import routes from '@/data/routes';
import { isActiveRoute } from '@/lib/routes';
import { AUTHOR_NAME } from '@/lib/utils';

import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

/**
 * Every address the homepage document is served at. GitHub Pages answers
 * `/index` and `/index.html` with the same file as `/`, and `usePathname`
 * reports the address bar, not the route that was prerendered. Asking only for
 * `/` would put the name where that file's HTML has the monogram, which React
 * treats as a hydration error and repairs by rendering the page a second time.
 */
const HOME_PATHS = new Set(['/', '/index', '/index.html']);

interface SiteHeaderProps {
  /** The author's name as a reader should see it, typographic apostrophe and all. */
  name: string;
}

export default function SiteHeader({ name }: SiteHeaderProps) {
  const pathname = usePathname();
  // The hero sets the name at display size directly under the header, so the
  // homepage keeps the monogram. Every other page gets the name itself: "md"
  // alone left them never saying whose site this is above the fold, and
  // `/contact`, which has no footer, never saying it at all.
  const home = HOME_PATHS.has(pathname);

  return (
    <header className="site-header">
      <div className="site-brand">
        <Link
          href="/"
          className={home ? 'site-logo' : 'site-logo site-logo--name'}
          aria-label={`${AUTHOR_NAME} — home`}
        >
          <span className="logo-text">{home ? 'md' : name}</span>
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
        <Hamburger name={name} />
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import routes from '@/data/routes';
import { isActiveRoute } from '@/lib/routes';
import { smartQuotes } from '@/lib/typography';
import { AUTHOR_NAME } from '@/lib/utils';

import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-brand">
        <Link
          href="/"
          className="site-logo"
          aria-label={`${AUTHOR_NAME} — home`}
        >
          <span className="logo-text">md</span>
          <span className="logo-name">{smartQuotes(AUTHOR_NAME)}</span>
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

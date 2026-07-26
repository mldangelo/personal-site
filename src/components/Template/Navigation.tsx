'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import routes from '@/data/routes';
import { isActiveRoute } from '@/lib/routes';

import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="site-logo">
        <span className="logo-text">MD</span>
      </Link>

      <nav className="nav-links">
        {routes
          .filter((l) => !l.index)
          .map((l) => (
            <Link
              key={l.label}
              href={l.path}
              className={`nav-link ${isActiveRoute(pathname, l.path) ? 'active' : ''}`}
              aria-current={
                isActiveRoute(pathname, l.path) ? 'page' : undefined
              }
            >
              {l.label}
            </Link>
          ))}
      </nav>

      <div className="nav-actions">
        <ThemeToggle />
        <Hamburger />
      </div>
    </header>
  );
}

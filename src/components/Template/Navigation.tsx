'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import routes from '../../data/routes';
import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

// Websites Navbar, displays routes defined in 'src/data/routes'
const Navigation: React.FC = () => {
  const pathname = usePathname();

  // Check if a route is active (exact match or starts with path for nested routes)
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

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
              className={`nav-link ${isActive(l.path) ? 'active' : ''}`}
              aria-current={isActive(l.path) ? 'page' : undefined}
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
};

export default Navigation;

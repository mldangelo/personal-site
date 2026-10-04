'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import routes from '@/data/routes';
import { useActiveSection } from '@/hooks/useActiveSection';

import AudioToggle from './AudioToggle';
import Hamburger from './Hamburger';
import ThemeToggle from './ThemeToggle';

const NAV_ROUTES = routes.filter((l) => !l.index);
const SECTION_IDS = NAV_ROUTES.flatMap((l) => l.sectionId ?? []);
const NO_SECTIONS: string[] = [];

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const activeSection = useActiveSection(isHome ? SECTION_IDS : NO_SECTIONS);

  // On the home page the active link follows the scroll position;
  // on standalone pages (/about, /resume, ...) it follows the URL.
  const isActive = (sectionId?: string) => {
    if (!sectionId) return isHome && activeSection === null;
    if (isHome) return activeSection === sectionId;
    return pathname?.startsWith(`/${sectionId}`) ?? false;
  };

  const HouseIcon = (
    <svg
      className="logo-icon"
      width="48"
      height="48"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="11" y="2" width="2" height="3" fill="#8e4828" />
      <rect x="11" y="2" width="2" height="1" fill="#a85c3f" />
      <rect x="7" y="3" width="2" height="1" fill="#c5483b" />
      <rect x="6" y="4" width="4" height="1" fill="#c5483b" />
      <rect x="5" y="5" width="6" height="1" fill="#c5483b" />
      <rect x="4" y="6" width="8" height="1" fill="#c5483b" />
      <rect x="3" y="7" width="10" height="1" fill="#c5483b" />
      <rect x="3" y="7" width="10" height="1" fill="#9c2f25" opacity="0.5" />
      <rect x="4" y="8" width="8" height="6" fill="#f0d8a8" />
      <rect x="11" y="8" width="1" height="6" fill="#d4b986" />
      <rect x="7" y="11" width="2" height="3" fill="#7a4a2a" />
      <rect x="8" y="12" width="1" height="1" fill="#f5d442" />
      <rect x="5" y="9" width="2" height="2" fill="#7ec8e3" />
      <rect x="9" y="9" width="2" height="2" fill="#7ec8e3" />
      <rect x="3" y="14" width="10" height="1" fill="#5cba6c" />
    </svg>
  );

  return (
    <header className="site-header">
      <Link
        href="/"
        className={`site-logo nav-link nav-link--home ${isActive() ? 'active' : ''}`}
        aria-label="Home"
        aria-current={isActive() ? 'page' : undefined}
      >
        {HouseIcon}
      </Link>

      <nav className="nav-links" aria-label="Sections">
        {NAV_ROUTES.map((l) => (
          <Link
            key={l.label}
            href={l.path}
            className={`nav-link ${isActive(l.sectionId) ? 'active' : ''}`}
            aria-current={
              isActive(l.sectionId) ? (isHome ? 'location' : 'page') : undefined
            }
          >
            {l.label}
          </Link>
        ))}
        <AudioToggle />
        <ThemeToggle />
      </nav>

      <div className="nav-actions">
        <Hamburger />
      </div>
    </header>
  );
}

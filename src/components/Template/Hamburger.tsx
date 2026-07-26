'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import routes from '../../data/routes';
import { isActiveRoute } from '../../lib/routes';
import SlideMenu from './SlideMenu';

const MENU_ID = 'mobile-nav-menu';

export default function Hamburger() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const slideMenu = (
    <SlideMenu id={MENU_ID} isOpen={open} onClose={closeMenu} position="right">
      {/* The trap keeps focus inside the dialog, so it needs a way out that
          is not the Escape key alone. */}
      <button
        type="button"
        className="slide-menu-close"
        onClick={closeMenu}
        aria-label="Close navigation menu"
      >
        <span aria-hidden="true">×</span>
      </button>
      <ul className="hamburger-ul">
        {routes
          .filter((l) => l.primary !== false)
          .map((l) => {
            const active = isActiveRoute(pathname, l.path);

            return (
              <li key={l.label}>
                {/* Navigation labels, not document sections — these were <h3>,
                  which put six phantom headings into the outline. */}
                <Link
                  href={l.path}
                  onClick={closeMenu}
                  className={active ? 'active' : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={l.index ? 'index-li' : undefined}>
                    {l.label}
                  </span>
                </Link>
              </li>
            );
          })}
      </ul>
    </SlideMenu>
  );

  return (
    <>
      <div className="hamburger-container">
        <div className="main" id="hamburger-nav">
          <ul>
            <li className="menu">
              <button
                type="button"
                onClick={toggleMenu}
                className="hamburger-button"
                aria-label={
                  open ? 'Close navigation menu' : 'Open navigation menu'
                }
                aria-expanded={open}
                aria-controls={MENU_ID}
              >
                {/* CSS-based hamburger/close icon for cross-platform consistency */}
                <span
                  className={`hamburger-icon${open ? ' hamburger-icon--open' : ''}`}
                >
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      {mounted && createPortal(slideMenu, document.body)}
    </>
  );
}

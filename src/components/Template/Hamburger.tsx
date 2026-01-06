'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import routes from '../../data/routes';
import SlideMenu from './SlideMenu';

const MENU_ID = 'mobile-nav-menu';

export default function Hamburger() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(() => setOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const slideMenu = (
    <SlideMenu id={MENU_ID} isOpen={open} onClose={closeMenu} position="right">
      <ul className="hamburger-ul">
        {routes.map((l) => (
          <li key={l.label}>
            <Link href={l.path} onClick={closeMenu}>
              <h3 className={l.index ? 'index-li' : undefined}>{l.label}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </SlideMenu>
  );

  return (
    <>
      <div className="hamburger-container">
        <nav className="main" id="hamburger-nav">
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
        </nav>
      </div>
      {mounted && createPortal(slideMenu, document.body)}
    </>
  );
}

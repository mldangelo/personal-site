'use client';

import Link from 'next/link';
import React, { lazy, Suspense, useState } from 'react';

import routes from '../../data/routes';

// @ts-expect-error - react-burger-menu doesn't have proper TypeScript definitions for lazy loading
const Menu = lazy(() => import('react-burger-menu/lib/menus/slide'));

const Hamburger: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="hamburger-container">
      <nav
        className="main"
        id="hamburger-nav"
        aria-label="Mobile navigation menu"
      >
        <ul>
          {open ? (
            <li className="menu close-menu">
              <button
                onClick={() => setOpen(!open)}
                className="menu-hover"
                aria-label="Close navigation menu"
                aria-expanded={open}
                type="button"
              >
                <span aria-hidden="true">&#10005;</span>
                <span className="sr-only">Close menu</span>
              </button>
            </li>
          ) : (
            <li className="menu open-menu">
              <button
                onClick={() => setOpen(!open)}
                className="menu-hover"
                aria-label="Open navigation menu"
                aria-expanded={open}
                type="button"
              >
                <span aria-hidden="true">&#9776;</span>
                <span className="sr-only">Open menu</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
      <Suspense
        fallback={
          <div role="status" aria-live="polite">
            <span className="sr-only">Loading menu...</span>
          </div>
        }
      >
        <Menu right isOpen={open}>
          <ul className="hamburger-ul">
            {routes.map((l) => (
              <li key={l.label}>
                <Link href={l.path} onClick={() => setOpen(!open)}>
                  <h3 className={l.index ? 'index-li' : undefined}>
                    {l.label}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </Menu>
      </Suspense>
    </div>
  );
};

export default Hamburger;

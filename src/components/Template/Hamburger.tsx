'use client';

import React, { Suspense, lazy, useState } from 'react';

import Link from 'next/link';

import routes from '../../data/routes';

// @ts-expect-error - react-burger-menu doesn't have proper TypeScript definitions for lazy loading
const Menu = lazy(() => import('react-burger-menu/lib/menus/slide'));

const Hamburger: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="hamburger-container">
      <nav className="main" id="hambuger-nav">
        <ul>
          {open ? (
            <li className="menu close-menu">
              <div onClick={() => setOpen(!open)} className="menu-hover">
                &#10005;
              </div>
            </li>
          ) : (
            <li className="menu open-menu">
              <div onClick={() => setOpen(!open)} className="menu-hover">
                &#9776;
              </div>
            </li>
          )}
        </ul>
      </nav>
      <Suspense fallback={<></>}>
        <Menu right isOpen={open}>
          <ul className="hamburger-ul">
            {routes.map((l) => (
              <li key={l.label}>
                <Link href={l.path} onClick={() => setOpen(!open)}>
                  <h3 className={l.index ? 'index-li' : undefined}>{l.label}</h3>
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

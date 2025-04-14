'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import routes from '../../data/routes';

// Dynamically import the Menu component with SSR disabled
const Menu = dynamic(
  () => import('react-burger-menu/lib/menus/slide').then((mod) => mod.default),
  { ssr: false, loading: () => <></> }
);

const Hamburger = () => {
  const [open, setOpen] = useState(false);

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
    </div>
  );
};

export default Hamburger; 
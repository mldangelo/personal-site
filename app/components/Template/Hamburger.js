'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState } from 'react';
import routes from '../../data/routes';

// Dynamically import the Menu component with SSR disabled
const Menu = dynamic(() => import('react-burger-menu/lib/menus/slide').then((mod) => mod.default), {
  ssr: false,
  loading: () => <></>,
});

const Hamburger = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="hamburger-container">
      <nav className="main" id="hambuger-nav">
        <ul>
          {open ? (
            <li className="menu close-menu">
              <button
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                className="menu-hover"
                aria-label="Close menu"
                type="button"
              >
                &#10005;
              </button>
            </li>
          ) : (
            <li className="menu open-menu">
              <button
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                className="menu-hover"
                aria-label="Open menu"
                type="button"
              >
                &#9776;
              </button>
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

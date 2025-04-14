'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import routes from '../../data/routes';

// We'll only render the BurgerMenu on the client side
const BurgerMenu = ({ open, setOpen }) => {
  // Import the burger menu component only on the client side
  const [Menu, setMenu] = useState(null);

  React.useEffect(() => {
    // Dynamically import the Menu component only on the client side
    import('react-burger-menu/lib/menus/slide')
      .then((module) => {
        setMenu(() => module.default);
      })
      .catch(err => {
        console.error('Failed to load burger menu:', err);
      });
  }, []);

  // Only render the menu if it's loaded
  if (!Menu) return null;

  return (
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
  );
};

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
      <BurgerMenu open={open} setOpen={setOpen} />
    </div>
  );
};

export default Hamburger; 
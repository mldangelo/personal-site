import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/free-solid-svg-icons/faBars';

import routes from '../../data/routes';

const Header = () => (
  <>
    <header id="header">
      <h1 className="index-link">
        {routes
          .filter((l) => l.index)
          .map((l) => (
            <Link key={l.label} href={l.path}>
              {l.label}
            </Link>
          ))}
      </h1>
      <nav className="links">
        <ul>
          {routes
            .filter((l) => !l.index)
            .map((l) => (
              <li key={l.label}>
                <Link href={l.path}>{l.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
      <nav className="main">
        <ul>
          <li className="menu">
            <a className="fa-bars" href="#menu">
              Menu
            </a>
            <FontAwesomeIcon icon={faBars} />
          </li>
        </ul>
      </nav>
    </header>
  </>
);

export default Header;

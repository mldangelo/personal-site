import React from 'react';
import Link from 'next/link';

// import Hamburger from './Hamburger';
import routes from '../../data/routes';

const Header = () => (
  <header id="header">
    <h1 className="index-link">
      {routes.filter((l) => l.index).map((l) => (
        <Link key={l.label} href={l.path}>{l.label}</Link>
      ))}
    </h1>
    <nav className="links">
      <ul>
        {routes.filter((l) => !l.index).map((l) => (
          <li key={l.label}>
            <Link href={l.path}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;

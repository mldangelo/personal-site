import React from 'react';
import { Link, IndexLink } from 'react-router';

import Hamburger from './Hamburger';
import links from '../../data/links';

const Header = () => (
  <header id="header">
    <h1 className="index-link">
      {links.filter(l => l.index).map(l => (
        <IndexLink key={l.label} to={l.link}>{l.label}</IndexLink>
      ))}
    </h1>
    <nav className="links">
      <ul>
        {links.filter(l => !l.index).map(l => (
          <li key={l.label}>
            <Link to={l.link}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
    <Hamburger />
  </header>
);

export default Header;

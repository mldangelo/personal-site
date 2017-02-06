import React from 'react';
import { Link, IndexLink } from 'react-router';

import Hamburger from './Header/Hamburger';
import links from '../../data/links';

const Header = () => (
  <header id="header">
    <h1 className="index-link">
      {links.filter(l => l.index).map(l => (<IndexLink to={l.link}>{l.label}</IndexLink>))}
    </h1>
    <nav className="links">
      <ul>
        {links.filter(l => !l.index).map(l => (<li><Link to={l.link}>{l.label}</Link></li>))}
      </ul>
    </nav>
    <Hamburger />
  </header>
);

export default Header;

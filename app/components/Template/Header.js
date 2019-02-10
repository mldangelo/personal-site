import React from 'react';
import { Link } from 'react-router-dom';

import Hamburger from './Hamburger';
import routes from '../../data/routes';

const Header = () => (
  <header id="header">
    <h1 className="index-link">
      {routes.filter(l => l.index).map(l => (
        <Link key={l.label} to={`${BASE_PATH}${l.path}`}>{l.label}</Link>
      ))}
    </h1>
    <nav className="links">
      <ul>
        {routes.filter(l => !l.index).map(l => (
          <li key={l.label}>
            <Link to={`${BASE_PATH}${l.path}`}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
    <Hamburger />
  </header>
);

export default Header;

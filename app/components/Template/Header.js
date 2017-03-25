import React from 'react';
import { Link } from 'react-router-dom';

import Hamburger from './Hamburger';
import routes from '../../data/routes';

const Header = () => (
  <header id="header">
    <h1 className="index-link">
      {routes.filter(l => l.index).map(l => (
        <Link key={l.label} to={l.path}>{l.label}</Link>
      ))}
    </h1>
    <nav className="links">
      <ul>
        {routes.filter(l => !l.index).map(l => (
          <li key={l.label}>
            <Link to={l.path}>{l.label}</Link>
          </li>
        ))}
        {window.admin ? <li><a href="/admin">Admin</a></li> : null}
        {window.id ? <li><a href="/logout">Logout</a></li> : null}
      </ul>
    </nav>
    <Hamburger />
  </header>
);

export default Header;

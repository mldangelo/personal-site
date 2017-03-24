import React from 'react';
import { Link, IndexLink } from 'react-router';

import Hamburger from './Hamburger';
import links from '../../data/links';
import auth from '../auth';

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
        {/*         {auth.loggedIn() ? <li><Link to="/logout">Logout</Link></li> : null} */}
        <li>{auth.loggedIn() ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}</li>
      </ul>
    </nav>
    <Hamburger />
  </header>
);

export default Header;

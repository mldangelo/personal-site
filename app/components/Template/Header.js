import React from 'react';
// import { Link, IndexLink } from 'react-router';

import {
  Link,
} from 'react-router-dom';

import Hamburger from './Hamburger';
import routes from '../../data/routes';
import auth from '../auth';

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
        {/*         {auth.loggedIn() ? <li><Link to="/logout">Logout</Link></li> : null} */}
        <li>{auth.loggedIn() ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}</li>
      </ul>
    </nav>
    <Hamburger />
  </header>
);

export default Header;

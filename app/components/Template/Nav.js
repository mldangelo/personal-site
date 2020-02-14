import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import data from '../../data/contact';

const Nav = () => (
  <Fragment>
    <section id="sidebar">
      <section id="intro">
        <Link to="/" className="logo">
          <img src={`${BASE_PATH}/images/chantelle_icon.jpg`} alt="" />
        </Link>
        <header>
          <h2>Casillas Law Group</h2>
          <p><a href="mailto:casillaslawgroup@gmail.com">casillaslawgroup@gmail.com</a></p>
        </header>
      </section>
    </section>

    <section id="footer">
      <ul className="icons">
        {data.map((s) => (
          <li key={s.label}>
            <a href={s.link}>
              <FontAwesomeIcon icon={s.icon} />
            </a>
          </li>
        ))}
      </ul>
      <p className="copyright">&copy; Casillas Law Group {(new Date().getFullYear())}</p>
    </section>
  </Fragment>
);

export default Nav;

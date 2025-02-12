import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Thomas Grapentin</h2>
        <p>
          <a href="mailto:thomas.grapentin@gmx.de">thomas.grapentin@gmx.de</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        Hi, I&apos;m Thomas. I am a highly curious student of Computer Science, Math, and Physics with a deep interest in Differential 
        Topology of 4-manifolds. Alongside my academic pursuits, I have a strong background in full-stack development and data science.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? (
            <Link to="/resume" className="button">
              Learn More
            </Link>
          ) : (
            <Link to="/about" className="button">
              About Me
            </Link>
          )}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Thomas D&apos;Angelo <Link to="/">mldangelo.com</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;

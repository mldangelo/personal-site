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
        <h2>Aida Ren 任一</h2>
        <p><a href="mailto:renyi1006@gmail.com">renyi1006@gmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Aida. I&apos;m a PhD Student in Tsinghua University.
        Now I&apos;m somewhere deciding my future,
        whether it&apos;s about continuing my research into recommendation system
        or switching to a more challenging and theoretical direction, quantum computing.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">&copy; Aida ren <Link to="/">www.renyi1006.com</Link>.</p>
    </section>
  </section>
);

export default SideBar;

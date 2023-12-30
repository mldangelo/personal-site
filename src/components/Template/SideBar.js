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
        <h2>Marc Gröling</h2>
        <p><a href="mailto:marc.groeling@gmail.com">marc.groeling@gmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hey, I&apos;m Marc. I&apos;m currently doing my master&apos;s in computer science
        with a specialisation in theoretical computer science at <a href="https://www.kth.se/en"> KTH</a> Stockholm, Sweden.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">&copy; Michael D&apos;Angelo <Link to="/">mldangelo.com</Link>.</p>
    </section>
  </section>
);

export default SideBar;

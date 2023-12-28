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
        <h2>Kyle McMaster</h2>
        <p><a href="mailto:kylejmcmaster@gmail.com">kylejmcmaster@gmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Kyle. I am a fourth year software engineering student at <a href="https://www.mcmaster.ca/"> McMaster University </a> with a minor in math and a passion for artificial intelligence.
  This website is my place to show some projects I'm working on.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">&copy; Kyle McMaster <Link to="/">kylemcmaster.ca</Link>.</p>
    </section>
  </section>
);

export default SideBar;

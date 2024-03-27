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
        <h2>Ebrahim Sharifnia</h2>
        <p><a href="mailto:ebrahim.sharif.n@gmail.com">ebrahim.sharif.n@gmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Ebrahim. I am a PhD candidate at <a href="https://ise.utk.edu//">Uni of Tennessee ISE</a>, 
      and a <a href="https://en.sharif.edu///">Sharif</a> Alumni.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">&copy; Ebrahim &apos;Sharifnia <Link to="/">ebrahim.sharif.n@gmail.com</Link>.</p>
    </section>
  </section>
);

export default SideBar;

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
        <h2>MOHAMMED AL-SADI</h2>
        <p><a href="mailto:ipqtr@hotmail.com">ipqtr@hotmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Mohammed. I like building mobile apps then keep worrying about their security.
        I am a <a href="https://hbku.edu.qa/">HBKU</a>, <a href="https://www.boorkes.ac.uk/">Oxford Brookes</a>,
        and <a href="https://just.edu.jo/">JUST</a> graduate.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">&copy; MOHAMMED D&apos;AL-SADI <Link to="/">al-sadi.com</Link>.</p>
    </section>
  </section>
);

export default SideBar;

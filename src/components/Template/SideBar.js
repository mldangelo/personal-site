import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.png`} alt="" />
      </Link>
      <header>
        <h2>Marius Mercier</h2>
        <p><a href="mailto:mariusmercier1@gmail.com">mariusmercier1@gmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Marius. I am a French PhD Candidate in Cognitive Sciences at <a href="https://en.wikipedia.org/wiki/%C3%89cole_normale_sup%C3%A9rieure_(Paris)">the Ecole Normale Supérieure</a>,
        part of <a href="https://psl.eu/en/university/psl-international-rankings"> Paris Sciences & Letters (PSL) University </a>.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
    </section>
  </section>
);

export default SideBar;

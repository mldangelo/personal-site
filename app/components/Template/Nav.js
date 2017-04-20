import React from 'react';
import { Link } from 'react-router-dom';

import data from '../../data/contact';

const Nav = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="" className="logo"><img src="/images/me_icon.jpg" alt="" /></Link>
      <header>
        <h2>Michael D&apos;Angelo</h2>
        <p><a href="mailto:michael.l.dangelo@gmail.com">michael.l.dangelo@gmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Michael. I like building things.
            I am a <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate and
            the CTO of <a href="http://arthena.com">Arthena</a>. Before Arthena I was
            at <a href="http://planet.com">Planet</a>, <a href="http://planetaryresources.com">Planetary Resources</a>, <a href="http://facebook.com">Facebook</a>, and <a href="http://seds.org">SEDS</a>.</p>
      <ul className="actions">
        <li><Link to="/resume" className="button">Learn More</Link></li>
      </ul>
    </section>

    <section id="footer">
      <ul className="icons">
        {data.map(s => (
          <li key={s.label}>
            <a href={s.link} className={s.icon}><span className="label">{s.label}</span></a>
          </li>
        ))}
      </ul>
      <p className="copyright">&copy; Michael D&apos;Angelo <Link to="http://mldangelo.com">mldangelo.com</Link>.</p>
    </section>
  </section>
);

export default Nav;

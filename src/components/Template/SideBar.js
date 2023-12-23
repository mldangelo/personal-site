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
        <h2>Jason Lee</h2>
        <p><a href="mailto:jason@leejson.com">jason@leejson.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Jason. I am an undergraduate engineering student at <a href="https://berkeley.edu/">UC Berkeley</a> studying <a href="https://eecs.berkeley.edu/">EECS</a> and undergraduate AI researcher at <a href="https://bair.berkeley.edu/">Berkeley AI Lab</a>.
        Previously, I have worked at <a href="https://www.avetasystem.com/">Meditrina Inc.</a> as a software engineering intern/consultant.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">&copy; Jason Lee <Link to="/">leejson.com</Link>.</p>
    </section>
  </section>
);

export default SideBar;

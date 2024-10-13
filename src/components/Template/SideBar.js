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
        <h2>Pranav Mittal</h2>
        <p>
          <a href="mailto:2001pranavmittal@gmail.com">2001pranavmittal@gmail.com</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Pranav.
        I am a B.TECH. student at <a href="https://iitbhu.ac.in/">IIT(BHU), Varanasi</a> with
        an interest in hardware design and its application. I am passionate about engineering
        and want to expand my technical skills and apply them to real-world applications.
        I have worked on projects involving computer architecture, RTL models, and
        UVM which intrigue me as it is the crucial part of building chips that enables
        the working of all the devices present around us.
        {/* I am a  graduate, YC Alumni,
        and the VP of Engineering at
        Hi, I&apos;m Michael. I am a <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate, YC Alumni,
        and the VP of Engineering at <a href="https://smileidentity.com">Smile Identity</a>. Previously,
        I was the co-founder and CTO of <a href="https://arthena.com">Arthena</a>
        , co-founder of <a href="https://matroid.com">Matroid</a>, and worked at
        {' '}<a href="https://planet.com">Planet</a> and <a href="https://facebook.com">Facebook</a>. */}
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
        &copy; Pranav Mittal <Link to="/">github.com/pr-mittal</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;

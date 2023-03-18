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
        <h2>Sanket Tambare</h2>
        <p>
          <a href="mailto:sanket.tambare01@gmail.com">
            sanket.tambare01@gmail.com
          </a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        Hi, I&apos;m Sanket. I like to build things. I am a softwware developer
        specialized in full stack development and data analysis. Currently I am
        working as software developer at{' '}
        <a href="https://www.linkedin.com/company/emtec-inc/mycompany/verification/">
          Emtec Inc
        </a>
        . Besides these I am interested in blogging, designing, video editing
        and digital wellbeing. Checkout my{' '}
        <a href="https://linktr.ee/daredavil">portfolio links</a>. Thank you!
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
        &copy; Michael D&apos;Angelo <Link to="/">mldangelo.com</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;

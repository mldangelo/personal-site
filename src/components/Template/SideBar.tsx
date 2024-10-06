import React from 'react';
import { Link } from 'react-router-dom';
import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpeg`} alt="" />
      </Link>
      <header>
        <h2>Austin Dase</h2>
        <p>
          <a href="mailto:hi@dase.dev">hi@dase.dev</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        Hi, I&apos;m Austin. I am a{' '}
        <a href="https://www.rhsmith.umd.edu">University of Maryland</a> and{' '}
        <a href="https://www.towson.edu/fcsm/departments/computerinfosci/grad/computersci/">
          Towson University
        </a>{' '}
        graduate, and a Software Engineer at{' '}
        <a href="https://fundrise.com">Fundrise</a>. Previously, I was at{' '}
        <a href="https://www.travelers.com">Travelers</a>.
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
        &copy; Austin&apos;Dase <Link to="/">dase.dev</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;

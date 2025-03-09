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
        <h2>Shivam Arora</h2>
        <p>
          <a href="mailto:shivam.arora4896@gmail.com">shivam.arora4896@gmail.com</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        Hi, I&apos;m Shivam. I am a Transport Planner with a total of 3 years of
        experience in transport modeling, specializing in strategic modeling and
        data science. Skilled in automation and software development, I leverage
        Python and batch scripting to streamline workflows and enhance efficiency.
        I am majorly experienced in running traffic assisgnments using MATSim and SATURN,
        alongside in-depth analysis of mobility, spatial, and traffic datasets.
        I am passionate about integrating data science and automation to
        accelerate and optimize transport modeling processes, ensuring faster and
        more effective decision-making.
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
        &copy; Shivam Arora <Link to="/">https://shivam-a.github.io/</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;

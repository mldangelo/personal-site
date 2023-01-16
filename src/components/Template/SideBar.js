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
        <h2>Dhruv Doshi</h2>
        <p><a href="mailto:doshi.dhruv@outlook.com">doshi.dhruv@outlook.com</a></p>
        <ContactIcons />
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>I like learning and building stuff. Currently working as Lead Software Devloper with <a href="https://www.rbcroyalbank.com/personal.html">Royal Bank of Canada</a>. <a href="https://www.dal.ca/">Dalhousie University</a> and <a href="https://www.gtu.ac.in/"> Gujarat Tech University</a> Alumni, and
        the founder of <a href="https://dhruv25071999.wixsite.com/dcs-bbn">DCS-BBN</a>.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/about') ? <Link to="/about" className="button">Learn More</Link> : <Link to="/about" className="button">Learn More</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      {/* <ContactIcons /> */}
      <p className="copyright">&copy; Dhruv Doshi <Link to="/">doshidhruv.com</Link>.</p>
    </section>
  </section>
);

export default SideBar;

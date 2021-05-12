import React from 'react';
import { Link } from 'react-router-dom';

// import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Dhruv Doshi</h2>
        <p><a href="mailto:dhruvdoshi25071999@gmail.com">dhruvdoshi25071999@gmail.com</a></p>
        {/* <ContactIcons /> */}
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I Dhruv. I like building things.
        I am pursing masters from <a href="https://www.dal.ca/">Dalhousie University</a> ,
        <a href="https://www.gtu.ac.in/"> Gujarat Tech University</a> Alumni, and
        the founder of <a href="https://dhruv25071999.wixsite.com/dcs-bbn">DCS-BBN</a>.
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      {/* <ContactIcons /> */}
      <p className="copyright">&copy; Dhruv Doshi <Link to="/">dhruvdoshi.github.io</Link>.</p>
    </section>
  </section>
);

export default SideBar;

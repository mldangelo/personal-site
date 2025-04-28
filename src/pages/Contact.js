import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';
// import EmailLink from '../components/Contact/EmailLink';
import ContactIcons from '../components/Contact/ContactIcons';

const Contact = () => (
  <Main
    title="Contact"
    description="Contact Kai Zhang"
  >
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2>
            <Link to="/contact">Contact</Link>
          </h2>
          <p>Feel free to get in touch.</p>
        </div>
      </header>
      <div className="email-at">
        <h3>Office</h3>
        <p>
          ETH Zürich<br />
          Automatic Control Laboratory (IfA)<br />
          Physikstrasse 3, ETL K11<br />
          CH-8092 Zürich
        </p>
        {/* <EmailLink /> */}
      </div>
      <ContactIcons />
    </article>
  </Main>
);

export default Contact;

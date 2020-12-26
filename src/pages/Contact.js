import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Main from '../layouts/Main';
import EmailLink from '../components/Contact/EmailLink';
import data from '../data/contact';

const Contact = () => (
  <Main>
    <Helmet title="Contact">
      <meta name="description" content="Contact Michael D'Angelo via email @ michael.l.dangelo@gmail.com" />
    </Helmet>
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/contact">Contact</Link></h2>
        </div>
      </header>
      <div className="email-at">
        <p>Feel free to get in touch. You can email me at: </p>
        <EmailLink />
      </div>
      <ul className="icons">
        {data.map((s) => (
          <li key={s.label}>
            <a href={s.link}>
              <FontAwesomeIcon icon={s.icon} />
            </a>
          </li>
        ))}
      </ul>
    </article>
  </Main>
);

export default Contact;

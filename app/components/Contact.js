import React from 'react';
import { Link } from 'react-router';

import data from '../data/contact';

const Contact = () => (
  <article className="post" id="contact">
    <header>
      <div className="title">
        <h2><Link to="/contact">Contact</Link></h2>
      </div>
    </header>
    <ul className="icons">
      {data.map(s => (
        <li key={s.label}>
          <a href={s.link} className={s.icon}><span className="label">{s.label}</span></a>
        </li>
      ))}
    </ul>
  </article>
);

export default Contact;

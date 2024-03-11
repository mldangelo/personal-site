"use client";

import React from 'react';
import Link from 'next/link';

// import Main from '../layouts/Main';
import EmailLink from '../../src/components/Contact/EmailLink';
import ContactIcons from '../../src/components/Contact/ContactIcons';

const Contact = () => (
  <div
    title="Contact"
    description="Contact Michael D'Angelo via email @ hi@mldangelo.com"
  >
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2><Link href="/contact">Contact</Link></h2>
        </div>
      </header>
      <div className="email-at">
        <p>Feel free to get in touch. You can email me at: </p>
        <EmailLink />
      </div>
      <ContactIcons />
    </article>
  </div>
);

export default Contact;

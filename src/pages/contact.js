import React from 'react';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

import EmailLink from '../components/Contact/EmailLink';
import ContactIcons from '../components/Contact/ContactIcons';

const Contact = () => (
  <>
    <NextSeo
      title="Contact"
      description="Contact Michael D'Angelo via email @ michael.l.dangelo@gmail.com"
    />
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2 data-testid="heading">
            <Link href="/contact">Contact</Link>
          </h2>
        </div>
      </header>
      <div className="email-at">
        <p>Feel free to get in touch. You can email me at: </p>
        <EmailLink />
      </div>
      <ContactIcons />
    </article>
  </>
);

export default Contact;

'use client';

import Link from 'next/link';
import React from 'react';

import ContactIcons from '../components/Contact/ContactIcons';
import EmailLink from '../components/Contact/EmailLink';
import Main from '../components/Main';

export default function ContactPage() {
  return (
    <Main title="Contact" description="Contact Michael D'Angelo via email @ hi@mldangelo.com">
      <article className="post" id="contact">
        <header>
          <div className="title">
            <h2>
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
    </Main>
  );
}

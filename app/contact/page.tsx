import React from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

import PageWrapper from '../components/PageWrapper';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Multiple ways to contact Kai Zhang',
};

export default function ContactPage() {
  return (
    <PageWrapper>
      <article className="post" id="contact">
        <header>
          <div className="title">
            <h2>
              <Link href="/contact">Contact</Link>
            </h2>
            <p>Feel free to get in touch.</p>
          </div>
        </header>
        <div className="email-at">
          <h3>Office</h3>
          <p>
            ETH Zürich
            <br />
            Automatic Control Laboratory (IfA)
            <br />
            Physikstrasse 3, ETL K11
            <br />
            CH-8092 Zürich
          </p>
          {/* <EmailLink /> */}
        </div>
        <ContactIcons />
      </article>
    </PageWrapper>
  );
}

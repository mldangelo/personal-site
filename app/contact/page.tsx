import type { Metadata } from 'next';
import React from 'react';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

import PageWrapper from '../components/PageWrapper';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Contact Michael D'Angelo via email @ hi@mldangelo.com",
};

export default function ContactPage() {
  return (
    <PageWrapper hideFooter>
      <section className="contact-page">
        <header className="contact-header">
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-subtitle">
            I&apos;d love to hear from you
          </p>
        </header>
        <div className="contact-content">
          <p>Feel free to reach out. You can email me at:</p>
          <EmailLink />
          <div className="contact-socials">
            <p className="contact-socials-title">Or find me on</p>
            <ContactIcons />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

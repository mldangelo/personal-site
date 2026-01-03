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
          <p className="page-subtitle">I&apos;d love to hear from you</p>
        </header>
        <div className="contact-content">
          <p className="contact-intro">
            Have a question, project idea, or just want to say hello? Feel free
            to reach out.
          </p>
          <div className="contact-email-block">
            <EmailLink />
            <p className="contact-hint">
              I typically respond within a day or two
            </p>
          </div>
          <div className="contact-socials">
            <p className="contact-socials-title">Or connect with me</p>
            <ContactIcons />
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

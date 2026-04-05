import type { Metadata } from 'next';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description: 'Contact Elia Christ via email at code.eliachrist@gmail.com.',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <PageWrapper>
      <section className="contact-page">
        <header className="contact-header">
          <h1 className="page-title">Get in Touch</h1>
        </header>

        <div className="contact-content">
          <div className="contact-email-block">
            <EmailLink />
            <p className="contact-hint">Usually respond within 24 hours</p>
          </div>

          <div className="contact-divider">
            <span>or find me on</span>
          </div>

          <ContactIcons />
        </div>
      </section>
    </PageWrapper>
  );
}

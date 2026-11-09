import type { Metadata } from 'next';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';
import PageWrapper from '@/components/Template/PageWrapper';
import profile from '@/data/profile.json';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description: `Contact ${profile.name} via email at ${profile.email}.`,
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <PageWrapper hideFooter>
      <section className="contact-page">
        <h1 className="page-title">Get in touch</h1>
        <EmailLink />
        <p className="contact-hint page-prose">
          I usually respond within 24 hours. For speaking invitations, email is
          best.
        </p>
        <ContactIcons includeEmail={false} labelled />
      </section>
    </PageWrapper>
  );
}

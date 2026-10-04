import type { Metadata } from 'next';

import ContactSection from '@/components/Contact/ContactSection';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Contact',
  description: 'Contact Hang Hang via email or LinkedIn.',
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <PageWrapper>
      <ContactSection />
    </PageWrapper>
  );
}

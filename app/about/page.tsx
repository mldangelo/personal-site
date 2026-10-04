import type { Metadata } from 'next';

import AboutSection from '@/components/About/AboutSection';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About',
  description:
    'Learn about Hang Hang — Computer Science + Business student at Northeastern, currently TA-ing Foundations of Data Science and seeking Summer 2026 internships.',
  path: '/about/',
});

export default function AboutPage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <AboutSection />
    </PageWrapper>
  );
}

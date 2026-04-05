import type { Metadata } from 'next';

import AboutContent from '@/components/About/Sections';
import PageWrapper from '@/components/Template/PageWrapper';
import { aboutMarkdown } from '@/data/about';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About',
  description:
    'Learn about Elia Christ — software developer, portfolio, and background.',
  path: '/about/',
});

export default function AboutPage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="about-page">
        <header className="about-header">
          <h1 className="page-title">About</h1>
        </header>
        <AboutContent markdown={aboutMarkdown} />
      </section>
    </PageWrapper>
  );
}

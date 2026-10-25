import type { Metadata } from 'next';

import Personal from '@/components/Stats/Personal';
import Site from '@/components/Stats/Site';

import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { AUTHOR_NAME } from '@/lib/utils';

export const metadata: Metadata = createPageMetadata({
  title: 'Stats',
  description: `Some statistics about ${AUTHOR_NAME} and mldangelo.com`,
  path: '/stats/',
});

export default function StatsPage() {
  return (
    <PageWrapper>
      <section className="stats-page">
        <header className="stats-header">
          <h1 className="stats-title">Stats</h1>
          <p className="stats-subtitle">Some fun numbers</p>
        </header>
        <div className="stats-content">
          <section aria-labelledby="stats-about-me">
            <div className="section-header">
              <h2 id="stats-about-me" className="section-heading">
                About me
              </h2>
            </div>
            <Personal />
          </section>
          <section aria-labelledby="stats-this-site">
            <div className="section-header">
              <h2 id="stats-this-site" className="section-heading">
                This site
              </h2>
            </div>
            <Site />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}

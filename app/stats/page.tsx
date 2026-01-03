import type { Metadata } from 'next';

import Personal from '@/components/Stats/Personal';
import Site from '@/components/Stats/Site';

import PageWrapper from '../components/PageWrapper';

export const metadata: Metadata = {
  title: 'Stats',
  description: "Some statistics about Michael D'Angelo and mldangelo.com",
};

export default function StatsPage() {
  return (
    <PageWrapper>
      <section className="stats-page">
        <header className="stats-header">
          <h1 className="stats-title">Stats</h1>
          <p className="stats-subtitle">Some fun numbers</p>
        </header>
        <div className="stats-content">
          <section>
            <h2 className="stats-section-title">About me</h2>
            <Personal />
          </section>
          <section>
            <h2 className="stats-section-title">This site</h2>
            <Site />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}

import type { Metadata } from 'next';
import React from 'react';

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
          <h1 className="page-title">Stats</h1>
          <p className="page-subtitle">Some fun numbers</p>
        </header>
        <div className="stats-content">
          <Personal />
          <Site />
        </div>
      </section>
    </PageWrapper>
  );
}

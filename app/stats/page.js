'use client';

import Link from 'next/link';
import React, { Suspense } from 'react';

import Main from '../components/Main';

import Personal from '../components/Stats/Personal';
import Site from '../components/Stats/Site';

// Loading fallback for stats sections
const StatsSectionLoader = ({ title }) => (
  <div>
    <h3>{title}</h3>
    <p>Loading stats...</p>
  </div>
);

export default function StatsPage() {
  return (
    <Main title="Stats" description="Some statistics about Michael D'Angelo and mldangelo.com">
      <article className="post" id="stats">
        <header>
          <div className="title">
            <h2>
              <Link href="/stats">Stats</Link>
            </h2>
          </div>
        </header>

        <Suspense fallback={<StatsSectionLoader title="Personal Stats" />}>
          <Personal />
        </Suspense>

        <Suspense fallback={<StatsSectionLoader title="Site Stats" />}>
          <Site />
        </Suspense>
      </article>
    </Main>
  );
}

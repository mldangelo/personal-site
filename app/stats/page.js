'use client';

import React from 'react';
import Link from 'next/link';

import Main from '../components/Main';

import Personal from '../components/Stats/Personal';
import Site from '../components/Stats/Site';

export default function StatsPage() {
  return (
    <Main
      title="Stats"
      description="Some statistics about Michael D'Angelo and mldangelo.com"
    >
      <article className="post" id="stats">
        <header>
          <div className="title">
            <h2>
              <Link href="/stats">Stats</Link>
            </h2>
          </div>
        </header>
        <Personal />
        <Site />
      </article>
    </Main>
  );
}
"use client";

import React from 'react';
import Link from 'next/link';

// import Main from '../layouts/Main';

import Personal from '../../components/Stats/Personal';
import Site from '../../components/Stats/Site';

const Stats = () => (
  <div
    title="Stats"
    description="Some statistics about Michael D'Angelo and mldangelo.com"
  >
    <article className="post" id="stats">
      <header>
        <div className="title">
          <h2><Link href="/stats">Stats</Link></h2>
        </div>
      </header>
      <Personal />
      <Site />
    </article>
  </div>
);

export default Stats;

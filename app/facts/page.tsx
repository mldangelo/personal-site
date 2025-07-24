import React from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

import Personal from '@/components/Facts/Personal';
import TextFacts from '@/components/Facts/TextFacts';

import PageWrapper from '../components/PageWrapper';

export const metadata: Metadata = {
  title: 'Facts',
  description: 'Some random facts about Kai Zhang.',
};

export default function FactsPage() {
  return (
    <PageWrapper>
      <article className="post" id="stats">
        <header>
          <div className="title">
            <h2>
              <Link href="/stats">Facts</Link>
            </h2>
            <p>
              The random facts about me are small yet certain proofs that I am unlike anyone else in
              this world.
            </p>
          </div>
        </header>
        <Personal />
        <TextFacts />
      </article>
    </PageWrapper>
  );
}

import React from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

import Cell from '@/components/Research/Cell';
import { researchData } from '@/data/research';

import PageWrapper from '../components/PageWrapper';

export const metadata: Metadata = {
  title: 'Research',
  description: "Learn about Kai Zhang's research projects.",
};

export default function ResearchPage() {
  return (
    <PageWrapper>
      <article className="post" id="research">
        <header>
          <div className="title">
            <h2>
              <Link href="/research">Research</Link>
            </h2>
            <p>A selection of research projects that I&apos;m not too ashamed of.</p>
          </div>
        </header>
        {researchData.map((topic) => (
          <Cell data={topic} key={topic.title} />
        ))}
      </article>
    </PageWrapper>
  );
}

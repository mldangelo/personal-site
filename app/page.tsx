import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import PageWrapper from './components/PageWrapper';

export const metadata: Metadata = {
  description:
    "Michael D'Angelo is a data scientist, machine learning engineer, and full-stack engineer.",
};

export default function HomePage() {
  return (
    <PageWrapper>
      <article className="post" id="index">
        <header>
          <div className="title">
            <h2>
              <Link href="/about">About this site</Link>
            </h2>
            <p>
              A beautiful, responsive, statically-generated, react application
              written with modern Javascript.
            </p>
          </div>
        </header>
        <p>
          {' '}
          Welcome to my website. Please feel free to read more{' '}
          <Link href="/about">about me</Link>, or you can check out my{' '}
          <Link href="/resume">resume</Link>,{' '}
          <Link href="/projects">projects</Link>, view{' '}
          <Link href="/stats">site statistics</Link>, or{' '}
          <Link href="/contact">contact</Link> me.
        </p>
        <p>
          {' '}
          Source available{' '}
          <a href="https://github.com/mldangelo/personal-site">here</a>.
        </p>
      </article>
    </PageWrapper>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import Hero from '@/components/Template/Hero';

import PageWrapper from './components/PageWrapper';

export const metadata: Metadata = {
  description:
    'Co-founder & CTO building LLM security tools. Previously VP Engineering, YC alum, Stanford ICME.',
};

export default function HomePage() {
  return (
    <PageWrapper>
      <Hero />

      <section className="home-section">
        <h2 className="section-title">
          <span className="section-title-text">About this site</span>
        </h2>
        <p className="section-desc">
          A statically-generated portfolio built with Next.js, TypeScript, and
          React. Feel free to explore my{' '}
          <Link href="/about">background</Link>,{' '}
          <Link href="/resume">resume</Link>,{' '}
          <Link href="/projects">projects</Link>, or{' '}
          <Link href="/contact">get in touch</Link>.
        </p>
        <p className="section-desc section-desc-muted">
          Source available on{' '}
          <a href="https://github.com/mldangelo/personal-site">GitHub</a>.
        </p>
      </section>
    </PageWrapper>
  );
}

'use client';

import Markdown from 'markdown-to-jsx';

import { aboutMarkdown } from '@/data/about';

import PageWrapper from '../components/PageWrapper';

const count = (str: string) =>
  str.split(/\s+/).filter((word) => word !== '').length;

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="about-page">
        <header className="about-header">
          <h1 className="page-title">About Me</h1>
          <p className="page-subtitle">
            A quick intro in {count(aboutMarkdown)} words
          </p>
        </header>
        <article className="about-content">
          <Markdown>{aboutMarkdown}</Markdown>
        </article>
      </section>
    </PageWrapper>
  );
}

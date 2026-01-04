import Markdown from 'markdown-to-jsx';
import type { Metadata } from 'next';

import PageWrapper from '@/components/Template/PageWrapper';
import { aboutMarkdown } from '@/data/about';

export const metadata: Metadata = {
  title: 'About',
  description:
    "Learn about Michael D'Angelo - Co-founder & CTO building LLM security tools.",
};

const countWords = (str: string) =>
  str.split(/\s+/).filter((word) => word !== '').length;

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="about-page">
        <header className="about-header">
          <h1 className="page-title">About Me</h1>
          <p className="page-subtitle">
            A quick intro in {countWords(aboutMarkdown)} words
          </p>
        </header>
        <article className="about-content">
          <Markdown>{aboutMarkdown}</Markdown>
        </article>
      </section>
    </PageWrapper>
  );
}

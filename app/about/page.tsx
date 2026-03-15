import type { Metadata } from 'next';

import AboutSections from '@/components/About/Sections';
import AboutTableOfContents from '@/components/About/TableOfContents';
import type { AboutSection } from '@/components/About/types';
import PageWrapper from '@/components/Template/PageWrapper';
import { aboutMarkdown } from '@/data/about';

export const metadata: Metadata = {
  title: 'About',
  description:
    "Learn about Michael D'Angelo - Member of the Technical Staff at OpenAI and builder across AI, security, and infrastructure.",
};

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s/-]/g, '')
    .trim()
    .replace(/[\/\s]+/g, '-');

const parseSections = (markdown: string): AboutSection[] =>
  markdown
    .trim()
    .split(/^# /m)
    .filter(Boolean)
    .map((block) => {
      const [title, ...bodyLines] = block.split('\n');
      return {
        title: title.trim(),
        body: bodyLines.join('\n').trim(),
        slug: slugify(title),
      };
    });

const aboutSections = parseSections(aboutMarkdown);

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="about-page">
        <header className="about-header">
          <h1 className="page-title">About Me</h1>
          <p className="page-subtitle about-subtitle">
            Work, history, travel, and the things that do not fit on a resume.
          </p>
        </header>

        <AboutTableOfContents sections={aboutSections} />
        <AboutSections sections={aboutSections} />
      </section>
    </PageWrapper>
  );
}

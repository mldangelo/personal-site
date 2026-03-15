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

const countWords = (str: string) =>
  str.split(/\s+/).filter((word) => word !== '').length;

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
const wordCount = new Intl.NumberFormat('en-US').format(
  countWords(aboutMarkdown),
);

export default function AboutPage() {
  return (
    <PageWrapper mainClassName="about-main">
      <section className="about-page">
        <div className="about-shell">
          <aside className="about-rail">
            <header className="about-header">
              <p className="about-eyebrow">Field Notes</p>
              <h1 className="page-title">About Me</h1>
              <p className="page-subtitle">
                {aboutSections.length} sections · {wordCount} words
              </p>
              <p className="about-summary">
                Work, history, travel, habits, and the parts of my life that do
                not fit neatly on a resume.
              </p>
            </header>
            <AboutTableOfContents sections={aboutSections} />
          </aside>

          <AboutSections sections={aboutSections} />
        </div>
      </section>
    </PageWrapper>
  );
}

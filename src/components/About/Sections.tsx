'use client';

import Markdown from 'markdown-to-jsx';

interface AboutContentProps {
  markdown: string;
}

interface AboutSection {
  body: string;
  title: string;
}

const compactSectionTitles = new Set([
  'I Like',
  'I Dream Of',
  'Websites from People I Admire',
]);

function splitAboutMarkdown(markdown: string) {
  const trimmed = markdown.trim();
  const introHeading = '# Intro';

  if (!trimmed.startsWith(introHeading)) {
    return {
      intro: '',
      sections: parseSections(trimmed),
    };
  }

  const withoutIntroHeading = trimmed.slice(introHeading.length).trimStart();
  const nextHeadingIndex = withoutIntroHeading.search(/\n# /);

  if (nextHeadingIndex === -1) {
    return {
      intro: withoutIntroHeading.trim(),
      sections: [] as AboutSection[],
    };
  }

  return {
    intro: withoutIntroHeading.slice(0, nextHeadingIndex).trim(),
    sections: parseSections(
      withoutIntroHeading.slice(nextHeadingIndex + 1).trim(),
    ),
  };
}

function parseSections(markdown: string): AboutSection[] {
  return markdown
    .split(/\n(?=# )/)
    .map((section) => section.trim())
    .filter((section) => section !== '')
    .map((section) => {
      const [heading, ...rest] = section.split('\n');

      return {
        title: heading.replace(/^#\s+/, '').trim(),
        body: rest.join('\n').trim(),
      };
    });
}

function getSectionClassName(title: string) {
  return compactSectionTitles.has(title)
    ? 'about-section about-section--compact'
    : 'about-section';
}

export default function AboutContent({ markdown }: AboutContentProps) {
  const { intro, sections } = splitAboutMarkdown(markdown);

  return (
    <article className="about-content">
      {intro ? (
        <div className="about-intro">
          <Markdown>{intro}</Markdown>
        </div>
      ) : null}
      {sections.map((section) => (
        <section
          key={section.title}
          className={getSectionClassName(section.title)}
        >
          <h2>{section.title}</h2>
          <Markdown>{section.body}</Markdown>
        </section>
      ))}
    </article>
  );
}

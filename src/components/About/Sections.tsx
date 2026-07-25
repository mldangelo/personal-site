'use client';

import Markdown from 'markdown-to-jsx';
import { Children, type ReactNode } from 'react';
import { createUniqueHeadingIds } from '@/lib/anchors';
import { extractLogMarker } from '@/lib/logEntry';

interface AboutContentProps {
  markdown: string;
}

const LOG_VARIANT = 'about-section--log';

/**
 * A single log entry, with any leading temporal marker lifted into the gutter.
 *
 * markdown-to-jsx has already parsed the entry, so the marker lives in the
 * first child when that child is plain text. Entries that open with a link or
 * with no marker at all keep their text intact and simply leave the gutter
 * empty — the alternative would be rewording the source to fit the layout.
 */
function LogEntry({ children }: { children?: ReactNode }) {
  const nodes = Children.toArray(children);
  const [first, ...rest] = nodes;
  const extracted = typeof first === 'string' ? extractLogMarker(first) : null;

  if (!extracted) {
    return (
      <li className="log-entry">
        <span className="log-entry-marker" />
        <span className="log-entry-body">{children}</span>
      </li>
    );
  }

  return (
    <li className="log-entry">
      <span className="log-entry-marker">{extracted.marker}</span>
      <span className="log-entry-body">
        {extracted.rest}
        {rest}
      </span>
    </li>
  );
}

const LOG_MARKDOWN_OPTIONS = {
  overrides: { li: { component: LogEntry } },
};

interface AboutSection {
  body: string;
  id: string;
  title: string;
}

interface ParsedAboutSection {
  body: string;
  title: string;
}

/**
 * Sections whose lists are chronological get the log treatment: entries
 * hang off a spine with a tick each, the same device the resume uses.
 * The rest stay as plain lists, because order carries no meaning there.
 */
const sectionVariants: Record<string, string> = {
  'Some History': 'about-section--log',
  'Travel / Geography': 'about-section--log',
  'Fun Facts': 'about-section--compact',
  'I Like': 'about-section--compact',
  'I Dream Of': 'about-section--compact',
  'Websites from People I Admire': 'about-section--links',
};

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
  const sections: ParsedAboutSection[] = markdown
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

  const sectionIds = createUniqueHeadingIds(
    sections.map((section) => section.title),
  );

  return sections.map((section, index) => ({
    ...section,
    id: sectionIds[index] ?? 'section',
  }));
}

function getSectionClassName(title: string) {
  const variant = sectionVariants[title];
  return variant ? `about-section ${variant}` : 'about-section';
}

function isLogSection(title: string) {
  return sectionVariants[title] === LOG_VARIANT;
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
      {sections.length > 0 ? (
        <nav className="about-section-nav" aria-label="About sections">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="about-section-nav-link"
            >
              {section.title}
            </a>
          ))}
        </nav>
      ) : null}
      {sections.map((section) => (
        <section
          key={section.id}
          className={getSectionClassName(section.title)}
        >
          <h2 id={section.id}>
            <a href={`#${section.id}`} className="about-section-heading-link">
              <span>{section.title}</span>
              <span className="about-section-heading-hash" aria-hidden="true">
                #
              </span>
            </a>
          </h2>
          {isLogSection(section.title) ? (
            <Markdown options={LOG_MARKDOWN_OPTIONS}>{section.body}</Markdown>
          ) : (
            <Markdown>{section.body}</Markdown>
          )}
        </section>
      ))}
    </article>
  );
}

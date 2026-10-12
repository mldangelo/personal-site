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
 * A single log entry, with its explicit temporal marker read into the gutter.
 *
 * markdown-to-jsx has already parsed the entry, so the marker lives in the
 * first child when that child is plain text. Entries may state an age, a year,
 * or both; the gutter does not derive a counterpart from an imprecise date.
 * Entries that open with a link or carry no marker at all keep their text
 * intact and simply leave the gutter empty.
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

  const markerRepeatsBody = extracted.rest === first;

  return (
    <li className="log-entry">
      <span
        className="log-entry-marker"
        aria-hidden={markerRepeatsBody || undefined}
      >
        {extracted.year ? (
          <span className="log-entry-year">{extracted.year}</span>
        ) : null}
        {extracted.age ? (
          <span className="log-entry-age">{extracted.age}</span>
        ) : null}
      </span>
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
 *
 * A section is matched by its exact title, as authored. Rename a heading in
 * `src/data/about.ts` and its key here has to follow, or the section falls
 * back to a plain list without a word. Its id does not move with the casing:
 * that is derived case-insensitively, so the deep links hold.
 */
const sectionVariants: Record<string, string> = {
  'Some history': 'about-section--log',
  'Travel / geography': 'about-section--log',
  'Fun facts': 'about-section--compact',
  'I like': 'about-section--compact',
  'I dream of': 'about-section--compact',
  'Websites from people I admire': 'about-section--links',
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
          <div className="section-header">
            {/* The id stays on the heading: it is the public fragment, and
                the heading is what the stylesheet gives a scroll margin. */}
            <h2 id={section.id} className="section-heading">
              <a href={`#${section.id}`} className="about-section-heading-link">
                {section.title}
                <span className="about-section-heading-hash" aria-hidden="true">
                  #
                </span>
              </a>
            </h2>
          </div>
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

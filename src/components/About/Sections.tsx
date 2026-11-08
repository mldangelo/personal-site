'use client';

import Markdown, { type MarkdownToJSX } from 'markdown-to-jsx';
import { Children, type ReactNode } from 'react';
import useActiveSection from '@/hooks/useActiveSection';
import { createUniqueHeadingIds } from '@/lib/anchors';
import { extractLogMarker } from '@/lib/logEntry';
import { smartQuotesRule } from '@/lib/markdown';
import { smartQuotes } from '@/lib/typography';

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
 *
 * The text arrives with its quotes already set (`smartQuotesRule`). No
 * marker pattern contains a quote, so the reading is the same either way, and
 * the remainder is cut from the converted string rather than converted again
 * out of context.
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

const MARKDOWN_OPTIONS: MarkdownToJSX.Options = {
  renderRule: smartQuotesRule,
};

const LOG_MARKDOWN_OPTIONS: MarkdownToJSX.Options = {
  overrides: { li: { component: LogEntry } },
  renderRule: smartQuotesRule,
};

interface AboutSection {
  body: string;
  id: string;
  /** As a reader sees it: the heading and the section nav both print this. */
  title: string;
  /** The layout its list takes, when the title names one. */
  variant: string | undefined;
}

interface ParsedAboutSection {
  body: string;
  title: string;
}

/**
 * Sections whose lists are chronological get the log treatment: entries
 * hang off a spine with a tick each, the same device the resume uses.
 * The rest stay as lists, because order carries no meaning there: sentences
 * read down one column, set a little closer than the log, and the one list
 * of names runs in columns.
 *
 * A section is matched by its exact title, as authored. Rename a heading in
 * `src/data/about.ts` and its key here has to follow, or the section falls
 * back to a plain list without a word. Its id does not move with the casing:
 * that is derived case-insensitively, so the deep links hold.
 */
const sectionVariants: Record<string, string> = {
  'Some history': LOG_VARIANT,
  'Travel / geography': LOG_VARIANT,
  'Fun facts': 'about-section--compact',
  'I like': 'about-section--compact',
  'I dream of': 'about-section--compact',
  'Websites from people I admire': 'about-section--links',
};

/** The page opens with `# Intro`, whose text runs unheaded above the sections. */
function splitAboutMarkdown(markdown: string) {
  const [intro, ...sections] = markdown
    .trim()
    .replace(/^# Intro\s*/, '')
    .split(/\n(?=# )/);

  return { intro: intro.trim(), sections: parseSections(sections) };
}

function parseSections(chunks: string[]): AboutSection[] {
  const sections: ParsedAboutSection[] = chunks
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

  // The id and the variant are read from the title as authored. Only what a
  // reader sees is converted, and once, so the nav and the heading agree.
  return sections.map(({ body, title }, index) => ({
    body,
    id: sectionIds[index] ?? 'section',
    title: smartQuotes(title),
    variant: sectionVariants[title],
  }));
}

export default function AboutContent({ markdown }: AboutContentProps) {
  const { intro, sections } = splitAboutMarkdown(markdown);
  const { activeId, navRef, onLinkClick } = useActiveSection(
    sections.map((section) => section.id),
  );

  return (
    <article className="about-content">
      {intro ? (
        <div className="about-intro">
          <Markdown options={MARKDOWN_OPTIONS}>{intro}</Markdown>
        </div>
      ) : null}
      {sections.length > 0 ? (
        <nav
          ref={navRef}
          className="about-section-nav"
          aria-label="About sections"
        >
          {/* The bar stays opaque while this row scrolls and fades inside it. */}
          <div className="about-section-nav-row">
            {sections.map((section) => {
              const current = activeId === section.id;

              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={
                    current
                      ? 'about-section-nav-link active'
                      : 'about-section-nav-link'
                  }
                  aria-current={current ? 'location' : undefined}
                  onClick={onLinkClick}
                >
                  {section.title}
                </a>
              );
            })}
          </div>
        </nav>
      ) : null}
      {sections.map((section) => (
        <section
          key={section.id}
          className={
            section.variant
              ? `about-section ${section.variant}`
              : 'about-section'
          }
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
          <Markdown
            options={
              section.variant === LOG_VARIANT
                ? LOG_MARKDOWN_OPTIONS
                : MARKDOWN_OPTIONS
            }
          >
            {section.body}
          </Markdown>
        </section>
      ))}
    </article>
  );
}

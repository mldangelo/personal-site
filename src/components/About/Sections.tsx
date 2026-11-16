'use client';

import {
  astToJSX,
  type MarkdownToJSX,
  parser,
  RuleType,
} from 'markdown-to-jsx/react';
import { Children, type ReactNode } from 'react';
import SectionNav from '@/components/Template/SectionNav';
import { createUniqueHeadingIds } from '@/lib/anchors';
import { extractLogMarker } from '@/lib/logEntry';
import { sanitizeUrl, smartQuotesRule } from '@/lib/markdown';
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
  sanitizer: sanitizeUrl,
};

const LOG_MARKDOWN_OPTIONS: MarkdownToJSX.Options = {
  overrides: { li: { component: LogEntry } },
  renderRule: smartQuotesRule,
  sanitizer: sanitizeUrl,
};

interface AboutSection {
  nodes: MarkdownToJSX.ASTNode[];
  id: string;
  /** As a reader sees it: the heading and the section nav both print this. */
  title: string;
  /** The layout its list takes, when the title names one. */
  variant: string | undefined;
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

interface AboutChunk {
  nodes: MarkdownToJSX.ASTNode[];
  title: string;
}

/** A heading's text as authored, without its formatting. */
function plainText(nodes: MarkdownToJSX.ASTNode[]): string {
  return nodes
    .map((node) => {
      if ('text' in node && typeof node.text === 'string') return node.text;
      if ('children' in node && Array.isArray(node.children)) {
        return plainText(node.children);
      }
      return '';
    })
    .join('');
}

/**
 * The page as one parsed document, divided at its top-level headings. Parsing
 * before dividing keeps a `#` line in a code fence or an HTML comment from
 * opening a section, and lets a link use a reference defined in another one.
 * The page opens with `# Intro`, whose content runs unheaded above the rest.
 */
function splitAboutMarkdown(markdown: string) {
  const intro: MarkdownToJSX.ASTNode[] = [];
  const chunks: AboutChunk[] = [];

  for (const node of parser(markdown)) {
    // Its definitions are already resolved into the links that use them.
    if (node.type === RuleType.refCollection) continue;
    if (node.type === RuleType.heading && node.level === 1) {
      const title = plainText(node.children).trim();
      if (chunks.length > 0 || title !== 'Intro') {
        chunks.push({ title, nodes: [] });
      }
    } else {
      (chunks.at(-1)?.nodes ?? intro).push(node);
    }
  }

  return { intro, sections: parseSections(chunks) };
}

function parseSections(chunks: AboutChunk[]): AboutSection[] {
  const sectionIds = createUniqueHeadingIds(chunks.map(({ title }) => title));

  // The id and the variant are read from the title as authored. Only what a
  // reader sees is converted, and once, so the nav and the heading agree.
  return chunks.map(({ nodes, title }, index) => ({
    nodes,
    id: sectionIds[index],
    title: smartQuotes(title),
    variant: sectionVariants[title],
  }));
}

export default function AboutContent({ markdown }: AboutContentProps) {
  const { intro, sections } = splitAboutMarkdown(markdown);

  return (
    <article className="about-content">
      {intro.length > 0 ? (
        <div className="about-intro">{astToJSX(intro, MARKDOWN_OPTIONS)}</div>
      ) : null}
      {sections.length > 0 ? (
        <SectionNav
          label="About sections"
          className="about-section-nav"
          sections={sections}
        />
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
          {astToJSX(
            section.nodes,
            section.variant === LOG_VARIANT
              ? LOG_MARKDOWN_OPTIONS
              : MARKDOWN_OPTIONS,
          )}
        </section>
      ))}
    </article>
  );
}

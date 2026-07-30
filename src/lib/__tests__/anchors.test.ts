import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { getPostBySlug } from '@/lib/posts';
import {
  createHeadingId,
  createUniqueHeadingIds,
  planMarkdownHeadingAnchors,
} from '../anchors';

function getAboutSectionTitles(markdown: string): string[] {
  return Array.from(
    markdown.matchAll(/^# (.+)$/gm),
    (match) => match[1],
  ).filter((title) => title !== 'Intro');
}

describe('createHeadingId', () => {
  it.each([
    ['Some History', 'some-history'],
    ['Travel / Geography', 'travel-geography'],
    ['Research & Development', 'research-and-development'],
    ["Michael's Notes", 'michaels-notes'],
    ['Café Crème', 'cafe-creme'],
  ])('creates stable ids for %s', (title, expected) => {
    expect(createHeadingId(title)).toBe(expected);
  });

  it('falls back when a heading has no anchor-safe characters', () => {
    expect(createHeadingId('!!!')).toBe('section');
  });

  it('keeps the real about section ids stable', () => {
    expect(
      getAboutSectionTitles(aboutMarkdown).map((title) => [
        title,
        createHeadingId(title),
      ]),
    ).toEqual([
      ['Some History', 'some-history'],
      ['I Like', 'i-like'],
      ['Travel / Geography', 'travel-geography'],
      ['Fun Facts', 'fun-facts'],
      ['I Dream Of', 'i-dream-of'],
      ['Websites from People I Admire', 'websites-from-people-i-admire'],
    ]);
  });
});

describe('createUniqueHeadingIds', () => {
  it('deduplicates repeated heading ids predictably', () => {
    expect(
      createUniqueHeadingIds([
        'Travel / Geography',
        'Travel / Geography',
        '!!!',
        '!!!',
      ]),
    ).toEqual([
      'travel-geography',
      'travel-geography-2',
      'section',
      'section-2',
    ]);
  });

  it('produces unique, non-empty ids for the real about headings', () => {
    const ids = createUniqueHeadingIds(getAboutSectionTitles(aboutMarkdown));

    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

const aliasesFor = (markdown: string) =>
  planMarkdownHeadingAnchors(markdown).aliases;

describe('planMarkdownHeadingAnchors', () => {
  it('emits nothing when both slug schemes agree', () => {
    expect(aliasesFor('## Verification layers\n\n## The workflow\n')).toEqual(
      new Map(),
    );
  });

  it('recovers the ids the real published post used to serve', () => {
    const post = getPostBySlug('shipping-with-claude-code');
    if (!post) {
      throw new Error('expected shipping-with-claude-code to be published');
    }

    expect(aliasesFor(post.content)).toEqual(
      new Map([
        [
          'on-using-dangerously-skip-permissions',
          'on-using---dangerously-skip-permissions',
        ],
        [
          'browser-automation-chrome-for-interaction-playwright-mcp-for-screenshots',
          'browser-automation---chrome-for-interaction-playwright-mcp-for-screenshots',
        ],
        [
          'plan-mode-writing-plans-to-files',
          'plan-mode--writing-plans-to-files',
        ],
        ['claude-md-agents-md', 'claudemd--agentsmd'],
      ]),
    );
  });

  it('covers a heading written after the rename with no list to update', () => {
    expect(aliasesFor('## Shipping `--yolo` mode\n')).toEqual(
      new Map([['shipping-yolo-mode', 'shipping---yolo-mode']]),
    );
  });

  it('suppresses an alias that another heading already owns as its canonical id', () => {
    // `Node.js` used to publish `nodejs`, which the second heading now derives
    // canonically. Two elements sharing an id is worse than one dead link, so
    // the alias is dropped rather than emitted.
    const aliases = aliasesFor('## Node.js\n\n## Nodejs\n');

    expect(aliases.get('node-js')).toBeUndefined();
    expect(aliases).toEqual(new Map());
  });

  it('suppresses a legacy id when two headings would claim it', () => {
    // Both headings used to publish `a--b`; assigning the alias to either one
    // would make the other old deep link land at the wrong section.
    const aliases = aliasesFor('## A & B\n\n## A  B\n');

    expect(aliases).toEqual(new Map());
  });

  it('refuses to alias an id that appears on more than one heading', () => {
    expect(aliasesFor('## Using `--flag`\n\n## Using `--flag`\n')).toEqual(
      new Map(),
    );
  });

  it('never proposes an empty id as a link target', () => {
    expect(aliasesFor('## !!!\n')).toEqual(new Map());
  });
});

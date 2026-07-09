import { describe, expect, it } from 'vitest';

import { createHeadingId, createUniqueHeadingIds } from '../anchors';

// A multi-section fixture, independent of the real (single-section) about
// data, used to exercise bulk heading id generation.
const MULTI_SECTION_MARKDOWN = `# Intro

Lead paragraph.

# Some History

- Built a thing.

# I Like

- Running.

# Travel / Geography

- Went somewhere.

# Fun Facts

- A fact.

# I Dream Of

- Something.

# Websites from People I Admire

- [Example](https://example.com)
`;

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

  it('keeps section ids stable across a multi-section document', () => {
    expect(
      getAboutSectionTitles(MULTI_SECTION_MARKDOWN).map((title) => [
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

  it('produces unique, non-empty ids for a multi-section document', () => {
    const ids = createUniqueHeadingIds(
      getAboutSectionTitles(MULTI_SECTION_MARKDOWN),
    );

    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

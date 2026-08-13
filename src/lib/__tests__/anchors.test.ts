import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId, createUniqueHeadingIds } from '../anchors';

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

  it('does not collide with an explicit numeric suffix or fallback id', () => {
    expect(
      createUniqueHeadingIds([
        'Repeat',
        'Repeat',
        'Repeat 2',
        'Repeat',
        '!!!',
        'Section',
        '!!!',
      ]),
    ).toEqual([
      'repeat',
      'repeat-2',
      'repeat-2-2',
      'repeat-3',
      'section',
      'section-2',
      'section-3',
    ]);
  });

  it('avoids ids already reserved by the surrounding document', () => {
    expect(
      createUniqueHeadingIds(
        ['Custom', 'Note', 'Custom'],
        new Set(['custom', 'note']),
      ),
    ).toEqual(['custom-2', 'note-2', 'custom-3']);
  });

  it('produces unique, non-empty ids for the real about headings', () => {
    const ids = createUniqueHeadingIds(getAboutSectionTitles(aboutMarkdown));

    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

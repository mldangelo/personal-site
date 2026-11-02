import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId, createUniqueHeadingIds } from '../anchors';

describe('createHeadingId', () => {
  it.each([
    ['Research & Development', 'research-and-development'],
    ["Michael's Notes", 'michaels-notes'],
    ['Café Crème', 'cafe-creme'],
    ['!!!', 'section'],
  ])('creates a stable id for %s', (title, expected) => {
    expect(createHeadingId(title)).toBe(expected);
  });

  // Deep links into the about page depend on these staying as they are.
  it('keeps the real about section ids stable', () => {
    const titles = Array.from(
      aboutMarkdown.matchAll(/^# (.+)$/gm),
      (match) => match[1],
    ).filter((title) => title !== 'Intro');

    expect(createUniqueHeadingIds(titles).join(' ')).toBe(
      'some-history i-like travel-geography fun-facts i-dream-of websites-from-people-i-admire',
    );
  });
});

describe('createUniqueHeadingIds', () => {
  it('does not collide with an explicit numeric suffix or fallback id', () => {
    const titles = 'Repeat|Repeat|Repeat 2|Repeat|!!!|Section|!!!'.split('|');

    expect(createUniqueHeadingIds(titles).join(' ')).toBe(
      'repeat repeat-2 repeat-2-2 repeat-3 section section-2 section-3',
    );
  });

  it('avoids ids already reserved by the surrounding document', () => {
    expect(
      createUniqueHeadingIds(
        ['Custom', 'Note', 'Custom'],
        new Set(['custom', 'note']),
      ),
    ).toEqual(['custom-2', 'note-2', 'custom-3']);
  });
});

import { describe, expect, it } from 'vitest';

import {
  compareWritingItems,
  getPostNeighbours,
  getWritingItems,
  type WritingItem,
} from '../writing';

/** The slug a published essay's index entry was built from. */
function slugOf(item: WritingItem): string {
  const slug = item.url.match(/^\/writing\/([^/]+)\/$/)?.[1];
  if (!slug) {
    throw new Error(`not an on-site essay: ${item.url}`);
  }

  return slug;
}

describe('getWritingItems', () => {
  it('merges published local posts and external writing newest first', () => {
    const items = getWritingItems();

    expect(items.some((item) => !item.isExternal)).toBe(true);
    expect(items.some((item) => item.isExternal)).toBe(true);

    const dated = items.filter((item) => item.date);
    expect(
      dated.every(
        (item, index) =>
          index === 0 || dated[index - 1]!.date.localeCompare(item.date) >= 0,
      ),
    ).toBe(true);
  });

  it('uses canonical trailing-slash URLs for local posts', () => {
    const localItems = getWritingItems().filter((item) => !item.isExternal);

    expect(localItems.length).toBeGreaterThan(0);
    expect(localItems.every((item) => item.url.endsWith('/'))).toBe(true);
    expect(localItems.every((item) => item.source === 'On this site')).toBe(
      true,
    );
  });

  it('orders equal and undated entries deterministically', () => {
    const item = (
      title: string,
      date: string,
      url = `https://example.com/${title.toLowerCase()}`,
    ): WritingItem => ({
      title,
      date,
      url,
      description: '',
      isExternal: true,
      source: 'Example',
    });

    expect(
      [item('Zulu', ''), item('Alpha', '')].sort(compareWritingItems),
    ).toEqual([item('Alpha', ''), item('Zulu', '')]);
    expect(
      [item('Zulu', '2026-01-01'), item('Alpha', '2026-01-01')].sort(
        compareWritingItems,
      ),
    ).toEqual([item('Alpha', '2026-01-01'), item('Zulu', '2026-01-01')]);
  });
});

/**
 * Derived from the index rather than pinned to today's posts: publishing an
 * essay moves every neighbour, and a literal title here would turn red for
 * correct behaviour.
 */
describe('getPostNeighbours', () => {
  const essays = getWritingItems().filter((item) => !item.isExternal);

  it('has enough published essays for a first, a middle, and a last', () => {
    // Fewer than three and the cases below would pass by checking nothing.
    expect(essays.length).toBeGreaterThanOrEqual(3);
  });

  it('gives the newest essay an older neighbour and nothing newer', () => {
    expect(getPostNeighbours(slugOf(essays[0]))).toEqual({
      newer: undefined,
      older: essays[1],
    });
  });

  it('gives the oldest essay a newer neighbour and nothing older', () => {
    const last = essays.length - 1;

    expect(getPostNeighbours(slugOf(essays[last]))).toEqual({
      newer: essays[last - 1],
      older: undefined,
    });
  });

  it('names each neighbour for the side its date lies on', () => {
    for (const essay of essays) {
      const { newer, older } = getPostNeighbours(slugOf(essay));

      // Validated `YYYY-MM-DD` strings order the way their dates do.
      if (newer) {
        expect(newer.date >= essay.date, `newer than ${essay.url}`).toBe(true);
      }
      if (older) {
        expect(older.date <= essay.date, `older than ${essay.url}`).toBe(true);
      }
    }
  });

  it('reaches every essay, in the order the index lists them', () => {
    const walk = (
      from: WritingItem | undefined,
      step: 'newer' | 'older',
    ): string[] => {
      const visited: string[] = [];

      for (
        let essay = from;
        essay && visited.length <= essays.length;
        essay = getPostNeighbours(slugOf(essay))[step]
      ) {
        visited.push(essay.url);
      }

      return visited;
    };
    const listed = essays.map((essay) => essay.url);

    expect(walk(essays[0], 'older')).toEqual(listed);
    expect(walk(essays.at(-1), 'newer')).toEqual([...listed].reverse());
  });

  it('never steps onto writing published elsewhere', () => {
    for (const essay of essays) {
      const { newer, older } = getPostNeighbours(slugOf(essay));

      expect(newer?.isExternal ?? false, essay.url).toBe(false);
      expect(older?.isExternal ?? false, essay.url).toBe(false);
    }
  });

  it('has nothing to offer for a slug that is not a published essay', () => {
    expect(getPostNeighbours('no-such-essay')).toEqual({});
  });
});

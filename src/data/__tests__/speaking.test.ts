import { describe, expect, it } from 'vitest';

import { getAppearances } from '../speaking';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('speaking record', () => {
  const appearances = getAppearances();

  it('has entries', () => {
    expect(appearances.length).toBeGreaterThan(0);
  });

  it('dates every appearance with a real calendar day', () => {
    for (const { date } of appearances) {
      expect(date).toMatch(ISO_DATE);
      // Round-tripping rejects a well-formed but impossible day like 02-30.
      expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(
        date,
      );
    }
  });

  it('orders appearances newest first, whatever the source order', () => {
    const dates = appearances.map((appearance) => appearance.date);

    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('links every appearance to a distinct public listing', () => {
    const links = appearances.map((appearance) => appearance.link);

    for (const link of links) {
      expect(new URL(link).protocol).toBe('https:');
    }
    expect(new Set(links).size).toBe(links.length);
  });

  it('keeps every field a reader sees filled in', () => {
    for (const appearance of appearances) {
      for (const field of ['title', 'place', 'desc'] as const) {
        expect(appearance[field].trim()).not.toBe('');
      }
    }
  });
});

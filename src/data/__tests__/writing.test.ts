import { describe, expect, it } from 'vitest';

import writing from '../writing';

describe('writing data', () => {
  it('exports an array of writing items', () => {
    expect(Array.isArray(writing)).toBe(true);
    expect(writing.length).toBeGreaterThan(0);
  });

  it('each item has required properties', () => {
    for (const item of writing) {
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('description');

      expect(typeof item.title).toBe('string');
      expect(typeof item.url).toBe('string');
      expect(typeof item.date).toBe('string');
      expect(typeof item.description).toBe('string');
    }
  });

  it('titles are non-empty', () => {
    for (const item of writing) {
      expect(item.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('descriptions are non-empty', () => {
    for (const item of writing) {
      expect(item.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('urls are valid', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const item of writing) {
      expect(item.url).toMatch(urlRegex);
    }
  });

  it('dates are valid when non-empty', () => {
    for (const item of writing) {
      if (item.date && item.date.trim().length > 0) {
        const date = new Date(item.date);
        expect(date.toString()).not.toBe('Invalid Date');
      }
    }
  });

  it('has unique titles', () => {
    const titles = writing.map((w) => w.title);
    const uniqueTitles = new Set(titles);

    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('has unique urls', () => {
    const urls = writing.map((w) => w.url);
    const uniqueUrls = new Set(urls);

    expect(uniqueUrls.size).toBe(urls.length);
  });

  it('items with dates are sorted by date (most recent first)', () => {
    const itemsWithDates = writing.filter(
      (item) => item.date && item.date.trim().length > 0,
    );

    for (let i = 0; i < itemsWithDates.length - 1; i++) {
      const current = new Date(itemsWithDates[i].date);
      const next = new Date(itemsWithDates[i + 1].date);
      expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
    }
  });
});

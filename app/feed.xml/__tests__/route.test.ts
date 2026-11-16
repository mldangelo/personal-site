import { describe, expect, it, vi } from 'vitest';

import { GET } from '../route';

const data = vi.hoisted(() => ({ description: 'A description.' }));
vi.mock('@/lib/writing', () => ({
  getWritingItems: () => [
    {
      title: 'A post',
      url: 'https://example.com/post/',
      date: '2026-01-15',
      description: data.description,
      isExternal: true,
      source: 'Example',
    },
  ],
}));

describe('feed.xml route', () => {
  // Optional, and the newest item's date cannot say when the feed changed:
  // an edit, or a backdated post published later, leaves it where it was.
  it('states no lastBuildDate', async () => {
    const xml = await (await GET()).text();

    expect(xml).not.toContain('lastBuildDate');
  });

  // XML 1.0 cannot carry a vertical tab even escaped, and one makes the
  // whole feed unreadable.
  it('leaves out characters XML cannot carry', async () => {
    data.description = 'Before\u000bafter & more';
    const xml = await (await GET()).text();

    expect(xml).toContain('<description>Beforeafter &amp; more</description>');
  });
});

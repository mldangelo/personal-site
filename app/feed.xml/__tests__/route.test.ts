import { describe, expect, it } from 'vitest';

import { GET } from '../route';

describe('feed.xml route', () => {
  // Optional, and the newest item's date cannot say when the feed changed:
  // an edit, or a backdated post published later, leaves it where it was.
  it('states no lastBuildDate', async () => {
    const xml = await (await GET()).text();

    expect(xml).not.toContain('lastBuildDate');
  });
});

import { describe, expect, it } from 'vitest';

import { getWritingItems } from '@/lib/writing';

import { GET } from '../route';

describe('feed.xml route', () => {
  it('derives lastBuildDate from content rather than the build clock', async () => {
    const response = await GET();
    const xml = await response.text();

    // Derived from the content, so publishing something newer cannot fail it.
    // The noon timestamp is what still excludes the build clock: the route
    // builds every date as `${date}T12:00:00Z`, so a wall-clock value would
    // have to land on exactly 12:00:00 GMT to pass.
    const newest = getWritingItems().find((item) => item.date);
    const expected = new Date(`${newest?.date}T12:00:00Z`).toUTCString();

    expect(xml).toContain(`<lastBuildDate>${expected}</lastBuildDate>`);
  });
});

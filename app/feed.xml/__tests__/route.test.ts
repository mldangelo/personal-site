import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import { getWritingItems } from '@/lib/writing';

import { GET } from '../route';

describe('feed.xml route', () => {
  it('uses canonical trailing-slash links for writing pages', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/writing/`);
    expect(xml).toContain(`${SITE_URL}/writing/claude-code-outage/`);
    expect(xml).toContain(`${SITE_URL}/writing/eurostar-chatbot-analysis/`);
    expect(xml).toContain(`${SITE_URL}/writing/shipping-with-claude-code/`);
  });

  it('keeps the feed self link file-like', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/feed.xml`);
    expect(xml).not.toContain(`${SITE_URL}/feed.xml/`);
  });

  it('derives lastBuildDate from content rather than the build clock', async () => {
    const response = await GET();
    const xml = await response.text();

    // This pinned the then-newest item's date as a literal, so publishing
    // anything newer failed it for the right behaviour. Derive the
    // expectation from the content instead.
    //
    // The noon timestamp is what still excludes the build clock: the route
    // builds every date as `${date}T12:00:00Z`, so a wall-clock value would
    // have to land on exactly 12:00:00 GMT to pass.
    const newest = getWritingItems().find((item) => item.date);
    const expected = new Date(`${newest?.date}T12:00:00Z`).toUTCString();

    expect(xml).toContain(`<lastBuildDate>${expected}</lastBuildDate>`);
  });
});

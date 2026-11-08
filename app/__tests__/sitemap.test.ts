import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

describe('sitemap', () => {
  it('does not invent modification dates for static pages', () => {
    const staticEntries = sitemap().filter(
      (entry) => !entry.url.startsWith(`${SITE_URL}/writing/`),
    );

    expect(
      staticEntries.every((entry) => entry.lastModified === undefined),
    ).toBe(true);
  });
});

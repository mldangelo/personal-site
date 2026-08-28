import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';
import sitemap from '../sitemap';

describe('sitemap', () => {
  it('uses trailing slashes for exported page routes', () => {
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ url: `${SITE_URL}/` }),
        expect.objectContaining({ url: `${SITE_URL}/about/` }),
        expect.objectContaining({ url: `${SITE_URL}/resume/` }),
        expect.objectContaining({ url: `${SITE_URL}/projects/` }),
        expect.objectContaining({ url: `${SITE_URL}/contact/` }),
      ]),
    );
  });

  it('does not publish the retired stats route', () => {
    expect(sitemap()).not.toContainEqual(
      expect.objectContaining({ url: `${SITE_URL}/stats/` }),
    );
  });

  it('does not include retired writing routes', () => {
    expect(sitemap()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: expect.stringContaining('/writing/'),
        }),
      ]),
    );
  });

  it('does not invent modification dates for static pages', () => {
    expect(sitemap().every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });
});

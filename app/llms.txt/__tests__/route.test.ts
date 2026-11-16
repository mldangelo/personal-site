import { describe, expect, it } from 'vitest';

import routes from '@/data/routes';
import { SITE_URL } from '@/lib/utils';

import { metadata as about } from '../../about/page';
import { GET } from '../route';

describe('llms.txt route', () => {
  it("describes each page with that page's own metadata", async () => {
    const text = await GET().text();

    expect(text).toContain(
      `- [About](${SITE_URL}/about/): ${about.description}`,
    );
  });

  it('fails the build for a route it has no description for', () => {
    routes.push({ label: 'New page', path: '/new-page' });
    try {
      expect(() => GET()).toThrow('llms.txt has no description for /new-page');
    } finally {
      routes.pop();
    }
  });
});

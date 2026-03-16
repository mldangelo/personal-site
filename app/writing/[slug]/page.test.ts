import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';

import { generateMetadata } from './page';

describe('writing post metadata', () => {
  it('uses a trailing-slash canonical URL for posts', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'claude-code-outage' }),
    });

    expect(metadata.openGraph?.url).toBe(
      `${SITE_URL}/writing/claude-code-outage/`,
    );
  });
});

import { describe, expect, it } from 'vitest';

import { SHARE_IMAGE_PATH, SITE_URL } from '@/lib/utils';

import { generateMetadata } from './page';

describe('writing post metadata', () => {
  it('uses a trailing-slash canonical URL for posts', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'hello' }),
    });

    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/writing/hello/`);
  });

  it('falls back to the site share card when a post has no article image', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'hello' }),
    });

    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      SHARE_IMAGE_PATH,
    );
    expect(JSON.stringify(metadata.twitter?.images)).toContain(
      SHARE_IMAGE_PATH,
    );
  });
});

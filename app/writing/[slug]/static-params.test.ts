import { afterEach, expect, it, vi } from 'vitest';

import { generateStaticParams } from './page';

vi.mock('@/lib/posts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/posts')>()),
  getPostSlugs: () => [],
}));

afterEach(() => {
  vi.unstubAllEnvs();
});

// Next's own error for an empty list blames a missing `generateStaticParams`.
it('stops the export with the reason when no post is published', () => {
  vi.stubEnv('NODE_ENV', 'production');

  expect(() => generateStaticParams()).toThrow(
    'content/writing/ has no published post',
  );
});

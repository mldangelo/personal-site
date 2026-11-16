import { afterEach, expect, it, vi } from 'vitest';

import GoogleAnalytics from '../../Template/GoogleAnalytics';

afterEach(() => {
  vi.unstubAllEnvs();
});

// `next dev` shows drafts, whose titles and addresses must not reach the
// analytics property.
it.each([
  ['development', false],
  ['production', true],
])('loads analytics under NODE_ENV=%s: %s', (mode, loads) => {
  vi.stubEnv('NEXT_PUBLIC_GA_TRACKING_ID', 'G-TEST');
  vi.stubEnv('NODE_ENV', mode);

  expect(GoogleAnalytics() !== null).toBe(loads);
});

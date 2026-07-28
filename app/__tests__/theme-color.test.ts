import { describe, expect, it, vi } from 'vitest';

import { readColorToken } from '@/lib/tokens';
import { viewport } from '../layout';

// `next/font/local` only exists as a build-time transform, so importing the
// root layout for its `viewport` export needs it stubbed. The stub returns the
// shape `app/fonts.ts` destructures and nothing else. `vi.mock` is hoisted
// above the import above, which is why this can be a static import rather than
// a top-level `await import` — `target` here is es2015, which forbids one.
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-mock', className: 'font-mock', style: {} }),
}));

/**
 * The export shipped with no `theme-color` at all, so mobile browsers painted
 * their chrome from their own default rather than from the page. A single
 * unscoped value only fixes that for one of the two themes, which is why this
 * pins the media-scoped pair rather than merely pinning that a value exists.
 */
describe('theme-color', () => {
  const themeColor = viewport.themeColor;

  it('declares one media-scoped value per colour scheme', () => {
    expect(Array.isArray(themeColor)).toBe(true);
    expect(themeColor).toEqual([
      {
        media: '(prefers-color-scheme: light)',
        color: readColorToken('--color-bg-alt', 'light'),
      },
      {
        media: '(prefers-color-scheme: dark)',
        color: readColorToken('--color-bg-alt', 'dark'),
      },
    ]);
  });

  /**
   * `theme-color` sits directly above the page, and the sticky header tints
   * the page background rather than introducing its own surface. Reading
   * `--color-bg` instead would put the raised-surface colour next to the
   * page's.
   */
  it('uses the page background, not the raised surface', () => {
    const values = (
      themeColor as ReadonlyArray<{ media?: string; color: string }>
    ).map((entry) => entry.color);

    expect(values).not.toContain(readColorToken('--color-bg', 'light'));
    expect(values).not.toContain(readColorToken('--color-bg', 'dark'));
  });
});

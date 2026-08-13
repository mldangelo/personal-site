import { describe, expect, it } from 'vitest';

import { readColorToken } from '@/lib/tokens';

describe('readColorToken', () => {
  it('reads the light and dark page background as literal hex', () => {
    expect(readColorToken('--color-bg-alt', 'light')).toMatch(/^#[0-9a-f]{6}$/);
    expect(readColorToken('--color-bg-alt', 'dark')).toMatch(/^#[0-9a-f]{6}$/);
  });

  /**
   * The whole point of the media-scoped `theme-color` pair. If the two themes
   * ever resolved to the same value one of them would be wrong and nothing
   * else would notice.
   */
  it('resolves the two themes to different values', () => {
    expect(readColorToken('--color-bg-alt', 'light')).not.toBe(
      readColorToken('--color-bg-alt', 'dark'),
    );
  });

  it('reads the accent the icon set is generated from', () => {
    expect(readColorToken('--color-accent', 'light')).toMatch(/^#[0-9a-f]{6}$/);
  });

  /**
   * `--color-accent-light` is a `color-mix()`. A meta tag or a PNG cannot
   * resolve that, so it has to fail rather than return the function call as a
   * colour string.
   */
  it('refuses a token that is not a literal hex colour', () => {
    expect(() => readColorToken('--color-accent-light', 'light')).toThrow(
      /not a literal hex colour/,
    );
  });

  it('reports an undeclared token instead of returning undefined', () => {
    expect(() => readColorToken('--color-not-a-token', 'light')).toThrow(
      /not declared/,
    );
  });

  it('rejects anything that is not a custom property name', () => {
    expect(() => readColorToken('color-accent', 'light')).toThrow(
      /Not a custom property/,
    );
  });
});

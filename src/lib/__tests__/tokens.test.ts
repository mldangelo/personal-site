import { describe, expect, it } from 'vitest';

import { readColorToken } from '@/lib/tokens';

describe('readColorToken', () => {
  /**
   * The whole point of handing the bootstrap two chrome colours. If the two
   * themes ever resolved to the same value one of them would be wrong and
   * nothing else would notice.
   */
  it('resolves the two themes to different values', () => {
    expect(readColorToken('--color-bg-alt', 'light')).not.toBe(
      readColorToken('--color-bg-alt', 'dark'),
    );
  });

  /**
   * `--color-accent-underline` is a `color-mix()`. A meta tag or a PNG cannot
   * resolve that, so it has to fail rather than return the function call as a
   * colour string.
   */
  it('refuses a token that is not a literal colour', () => {
    expect(() => readColorToken('--color-accent-underline', 'light')).toThrow(
      /not a literal colour/,
    );
  });
});

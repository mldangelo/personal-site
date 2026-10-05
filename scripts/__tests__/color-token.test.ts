import { describe, expect, it } from 'vitest';

import { readLiteralColorToken } from '../lib/color-token.mjs';

describe('generator color tokens', () => {
  it.each(['#123', '#1234', '#123456', '#12345678'])(
    'accepts the CSS hex length in %s',
    (value) => {
      expect(
        readLiteralColorToken(
          `:root {\n  --color-example: ${value};\n}`,
          '--color-example',
        ),
      ).toBe(value);
    },
  );

  it.each(['#12', '#12345', '#1234567', '#123456789', 'var(--other)'])(
    'rejects the non-literal value %s',
    (value) => {
      expect(() =>
        readLiteralColorToken(
          `:root {\n  --color-example: ${value};\n}`,
          '--color-example',
        ),
      ).toThrow(/not a literal hex colour/);
    },
  );

  it('rejects an unsafe custom-property name', () => {
    expect(() =>
      readLiteralColorToken(
        ':root {\n  --color-example: #123456;\n}',
        '--color-example)|.*(',
      ),
    ).toThrow(/Not a custom property name/);
  });
});

import { describe, expect, it } from 'vitest';

import { readLiteralColorToken } from '../lib/color-token.mjs';

const stylesheet = (value: string) =>
  `:root {\n  --color-example: ${value};\n}`;

describe('generator color tokens', () => {
  it.each(['#123', '#1234', '#123456', '#12345678'])(
    'accepts the CSS hex length in %s',
    (value) => {
      expect(readLiteralColorToken(stylesheet(value), '--color-example')).toBe(
        value,
      );
    },
  );

  it.each(['#12', '#12345', '#1234567', '#123456789', 'var(--other)'])(
    'rejects the non-literal value %s',
    (value) => {
      expect(() =>
        readLiteralColorToken(stylesheet(value), '--color-example'),
      ).toThrow(/not a literal hex colour/);
    },
  );

  it('rejects an unsafe custom-property name', () => {
    expect(() =>
      readLiteralColorToken(stylesheet('#123456'), '--color-example)|.*('),
    ).toThrow(/Not a custom property name/);
  });
});

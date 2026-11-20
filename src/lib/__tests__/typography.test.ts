import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { smartQuotes } from '../typography';

describe('smartQuotes', () => {
  it.each([
    // The cases the site actually renders.
    ["Michael D'Angelo", 'Michael D’Angelo'],
    [
      'Notes on the Eurostar chatbot "vulnerability" report',
      'Notes on the Eurostar chatbot “vulnerability” report',
    ],
    ["say 'hello' now", 'say ‘hello’ now'],
    ["the '90s", 'the ’90s'],
    ['a quote —"after a dash"', 'a quote —“after a dash”'],
  ])('converts %j', (input, expected) => {
    expect(smartQuotes(input)).toBe(expected);
  });

  it('treats a quote that opens a string as an opening quote', () => {
    expect(smartQuotes('"Eurostar AI vulnerability')).toBe(
      '“Eurostar AI vulnerability',
    );
  });

  it('closes a quotation that began in an earlier text node', () => {
    // Markdown splits `"<a>title</a>" claiming` into separate text nodes.
    expect(smartQuotes('" claiming four issues')).toBe(
      '” claiming four issues',
    );
  });

  it('reads a leading possessive or contraction tail as an apostrophe', () => {
    // `<a>Promptfoo</a>'s platform` arrives as the text node "'s platform".
    expect(smartQuotes("'s platform")).toBe('’s platform');
  });

  it('leaves an inch mark alone', () => {
    expect(smartQuotes('a 15" display')).toBe('a 15" display');
  });

  it('leaves an inch mark alone inside a quotation', () => {
    expect(smartQuotes('He said "a 15" display".')).toBe(
      'He said “a 15" display”.',
    );
    expect(smartQuotes('"in 1999" and "2000"')).toBe('“in 1999” and “2000”');
  });
});

describe('typography source', () => {
  it('spells its character classes out instead of using Unicode property escapes', () => {
    // The build expands a property escape into every range it covers for the
    // browsers this site targets: 41 kB in each client bundle that imports
    // the helper, for a function that fits in one.
    const source = readFileSync(
      path.join(process.cwd(), 'src/lib/typography.ts'),
      'utf8',
    );
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '');

    expect(code).not.toMatch(/\\p\{/i);
  });
});

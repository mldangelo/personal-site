import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { smartQuotes } from '../typography';

describe('smartQuotes', () => {
  it.each([
    // The cases the site actually renders.
    ["Michael D'Angelo", 'Michael D’Angelo'],
    [
      "I'm a Member of the Technical Staff",
      'I’m a Member of the Technical Staff',
    ],
    [
      'Notes on the Eurostar chatbot "vulnerability" report',
      'Notes on the Eurostar chatbot “vulnerability” report',
    ],
    ["McKinsey's Lilli", 'McKinsey’s Lilli'],
    ["without my parents' permission", 'without my parents’ permission'],
    ['when a pane "dings," I merge', 'when a pane “dings,” I merge'],
    ['It\'s "fine"', 'It’s “fine”'],
    ["say 'hello' now", 'say ‘hello’ now'],
    ["the '90s", 'the ’90s'],
    ['("quoted")', '(“quoted”)'],
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
    expect(smartQuotes('".')).toBe('”.');
  });

  it('reads a leading possessive or contraction tail as an apostrophe', () => {
    // `<a>Promptfoo</a>'s platform` arrives as the text node "'s platform".
    expect(smartQuotes("'s platform")).toBe('’s platform');
    expect(smartQuotes("'ve shipped")).toBe('’ve shipped');
  });

  it('leaves an inch mark alone', () => {
    expect(smartQuotes('a 15" display')).toBe('a 15" display');
  });

  it('still closes a quotation that ends in a digit', () => {
    expect(smartQuotes('version "2.1.0" shipped')).toBe(
      'version “2.1.0” shipped',
    );
  });

  it('returns text without quotes untouched', () => {
    const text = 'Engineering leader with a career spanning 15+ years';
    expect(smartQuotes(text)).toBe(text);
  });

  it('is idempotent', () => {
    const once = smartQuotes('It\'s the "second" pass');
    expect(smartQuotes(once)).toBe(once);
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

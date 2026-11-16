import { describe, expect, it } from 'vitest';

import { publishedMarkdown } from '../published-markdown.mjs';

describe('publishedMarkdown', () => {
  it('passes a source with nothing to remove through untouched', () => {
    const source = 'Text with [a link][ref].\n\n[ref]: https://example.com\n';

    expect(publishedMarkdown(source)).toBe(source);
  });

  it('drops comments and unused definitions, and keeps code and footnote references', () => {
    const published = publishedMarkdown(
      [
        'Text [a][ref] <!-- inline note --> `<!-- code -->`.[^1]',
        '',
        '<!--',
        'A block note',
        '-->',
        '',
        '- An item <!-- list note -->',
        '',
        '```html',
        '<!-- fenced -->',
        '```',
        '',
        '[ref]: https://a.example',
        '[unused]: https://unused.example',
        '[cited]: https://cited.example',
        '[^1]: A footnote citing [the source][cited].',
      ].join('\n'),
    );

    expect(published).not.toMatch(/inline note|block note|list note|unused/i);
    expect(published).toContain('[a](https://a.example)');
    expect(published).toContain('`<!-- code -->`');
    expect(published).toContain('<!-- fenced -->');
    expect(published).toContain('[cited]: https://cited.example');
  });
});

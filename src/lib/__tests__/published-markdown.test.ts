import { describe, expect, it } from 'vitest';

import { publishedMarkdown } from '../published-markdown.mjs';

describe('publishedMarkdown', () => {
  it('passes a source with nothing to remove through untouched', () => {
    const source = 'Text with [a link](https://example.com).\n\n- An item\n';

    expect(publishedMarkdown(source)).toBe(source);
  });

  it('drops comments and definitions, and keeps code and what footnotes cite', () => {
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
        '<div>Raw <!-- raw note --></div>',
        '',
        '```html',
        '<!-- fenced -->',
        '```',
        '',
        '[ref]: https://a.example',
        '[unused]: https://unused.example',
        '[cited]: https://cited.example',
        '[^1]: A footnote citing [the source][cited] <!-- footnote note --> `<!-- kept -->`.',
      ].join('\n'),
    );

    expect(published).not.toMatch(
      /inline note|block note|list note|raw note|footnote note|unused/i,
    );
    expect(published).toContain('[a](https://a.example)');
    expect(published).toContain('`<!-- code -->`');
    expect(published).toContain('<!-- fenced -->');
    expect(published).toContain('`<!-- kept -->`');
    expect(published).toContain('[cited]: https://cited.example');
  });

  // A definition is used where a label cites it, not wherever its address
  // appears: its label and title are the author's own words.
  it('drops a definition no label cites, even when a link shares its address', () => {
    const published = publishedMarkdown(
      '[read](https://example.com)\n\n[internal-note]: https://example.com "Not approved"\n',
    );

    expect(published).not.toMatch(/internal-note|Not approved/);
    expect(published).toContain('[read](https://example.com)');
  });

  // Raw HTML is written back as authored, so a definition it cites stays.
  it('keeps a definition cited from inside raw HTML', () => {
    expect(
      publishedMarkdown(
        '<div>\n\n[x][keep]\n\n</div>\n\n[keep]: https://keep.example\n',
      ),
    ).toContain('[keep]: https://keep.example');
  });
});

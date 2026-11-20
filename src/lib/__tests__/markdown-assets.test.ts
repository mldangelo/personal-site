import { describe, expect, it } from 'vitest';

import { parseSrcset, readMarkdownReferences } from '../markdown-assets.mjs';

const image = (target: string) => ({ kind: 'image', target });

describe('readMarkdownReferences', () => {
  // A form the walk misses lets a draft-only file reach the export unflagged.
  it('follows reference-style images and attachments', () => {
    const markdown = [
      '![full][full]',
      '![collapsed][]',
      '![shortcut]',
      '[attachment][file]',
      '',
      '[full]: /images/full.png',
      '[collapsed]: /images/collapsed.png',
      '[shortcut]: /images/shortcut.png',
      '[file]: /downloads/notes.pdf',
    ].join('\n');

    expect(readMarkdownReferences(markdown)).toEqual([
      image('/images/full.png'),
      image('/images/collapsed.png'),
      image('/images/shortcut.png'),
      { kind: 'link', target: '/downloads/notes.pdf' },
    ]);
  });

  it('reads raw HTML resources and every srcset candidate', () => {
    const markdown = [
      '<picture>',
      '  <source srcset="/images/small.webp 480w, /images/large.webp 960w">',
      '  <img alt="a > b" src="/images/fallback.webp">',
      '</picture>',
      '<input type="image" src="/images/submit.png">',
      '<video poster="/images/poster.png" src="/media/demo.mp4"></video>',
      '<a href="/downloads/notes.pdf">Notes</a>',
    ].join('\n');

    expect(readMarkdownReferences(markdown)).toEqual([
      image('/images/small.webp'),
      image('/images/large.webp'),
      image('/images/fallback.webp'),
      image('/images/submit.png'),
      image('/images/poster.png'),
      { kind: 'asset', target: '/media/demo.mp4' },
      { kind: 'link', target: '/downloads/notes.pdf' },
    ]);
  });

  it('reads the links and images in footnote text', () => {
    const markdown = [
      'A claim.[^1]',
      '',
      '[^1]: See [the paper](/downloads/paper.pdf), ![chart](/images/chart.png),',
      '    and [the notes][notes].',
      '',
      '[notes]: /downloads/notes.pdf',
    ].join('\n');

    expect(readMarkdownReferences(markdown)).toEqual([
      { kind: 'link', target: '/downloads/paper.pdf' },
      image('/images/chart.png'),
      { kind: 'link', target: '/downloads/notes.pdf' },
    ]);
  });

  // The renderer reads footnote text inline, so this fence is text and the
  // link inside it is live, while code spans stay code.
  it('reads a footnote with inline rules, as the renderer does', () => {
    const markdown = [
      'Text.[^1]',
      '',
      '[^1]: ~~~',
      '    [download](/downloads/private.pdf) `[code](/not-a-link.pdf)`',
      '    ~~~',
    ].join('\n');

    expect(readMarkdownReferences(markdown)).toEqual([
      { kind: 'link', target: '/downloads/private.pdf' },
    ]);
  });

  it('decodes a footnote reference destination once, as the renderer does', () => {
    const markdown = [
      'A claim.[^1]',
      '',
      '[^1]: ![chart][chart] and [the data][data].',
      '',
      '[chart]: /images/a&amp;amp;b.png',
      '[data]: </downloads/a&gt;b.csv>',
    ].join('\n');

    expect(readMarkdownReferences(markdown)).toEqual([
      image('/images/a&amp;b.png'),
      { kind: 'link', target: '/downloads/a>b.csv' },
    ]);
  });

  it.each([
    String.raw`<div style="background-image:u\72l(/images/private.png)">Private</div>`,
    '<iframe src="data:text/html,<img src=https://mldangelo.com/private.png>"></iframe>',
    '<object data="data:text/html,<img src=https://mldangelo.com/private.png>"></object>',
    '<embed src="data:text/html,<img src=https://mldangelo.com/private.png>">',
    '<link rel="stylesheet" href="data:text/css,body{background:url(https://mldangelo.com/private.png)}">',
    '<script src="/scripts/private.js"></script>',
    '<style>.private { background: url(/images/private.png) }</style>',
    '<svg><rect fill="url(/images/private.svg#paint)"></rect></svg>',
    '<base href="/private/">',
    '<meta http-equiv="refresh" content="0;url=/private/">',
    // React renders the prop spelling as `http-equiv`.
    '<meta httpEquiv="refresh" content="0;url=/private/">',
  ])('fails closed for an uninspectable raw HTML fetch: %s', (markdown) => {
    expect(() => readMarkdownReferences(markdown)).toThrow(
      /not allowed|cannot be verified/i,
    );
  });

  it('allows embedded raster images but rejects active data documents', () => {
    expect(
      readMarkdownReferences('![pixel](data:image/png;base64,AAAA)'),
    ).toEqual([image('data:image/png;base64,AAAA')]);
    expect(() =>
      readMarkdownReferences(
        '![svg](data:image/svg+xml;base64,PHN2Zz48aW1hZ2UgaHJlZj0iL3ByaXZhdGUucG5nIi8+PC9zdmc+)',
      ),
    ).toThrow(/active data documents/i);
  });
});

describe('parseSrcset', () => {
  it('reads the URL of each candidate, whatever its descriptor', () => {
    expect(parseSrcset('/a.png 1x, /b.png 960w, /c.png')).toEqual([
      '/a.png',
      '/b.png',
      '/c.png',
    ]);
  });

  it.each(['/one.png 1x 2x', '/one.png nope'])(
    'fails closed for malformed srcset: %s',
    (srcset) => {
      expect(() => parseSrcset(srcset)).toThrow(/srcset/i);
    },
  );
});

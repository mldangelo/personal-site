import { describe, expect, it } from 'vitest';

import { parseSrcset, readMarkdownReferences } from '../markdown-assets.mjs';

describe('readMarkdownReferences', () => {
  it('follows every Markdown image and attachment form the renderer accepts', () => {
    const markdown = [
      '![nested [alt]](/images/nested.png)',
      String.raw`![escaped \] alt](/images/escaped.png)`,
      '![balanced](/images/a(1).png)',
      String.raw`![escaped destination](/images/a\)b.png)`,
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
      { kind: 'image', target: '/images/nested.png' },
      { kind: 'image', target: '/images/escaped.png' },
      { kind: 'image', target: '/images/a(1).png' },
      { kind: 'image', target: '/images/a)b.png' },
      { kind: 'image', target: '/images/full.png' },
      { kind: 'image', target: '/images/collapsed.png' },
      { kind: 'image', target: '/images/shortcut.png' },
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
      { kind: 'image', target: '/images/small.webp' },
      { kind: 'image', target: '/images/large.webp' },
      { kind: 'image', target: '/images/fallback.webp' },
      { kind: 'image', target: '/images/submit.png' },
      { kind: 'image', target: '/images/poster.png' },
      { kind: 'asset', target: '/media/demo.mp4' },
      { kind: 'link', target: '/downloads/notes.pdf' },
    ]);
  });

  it('ignores resource-looking text inside code', () => {
    const markdown = [
      '`![inline](/images/inline.png)`',
      '',
      '```md',
      '![fenced](/images/fenced.png)',
      '```',
    ].join('\n');

    expect(readMarkdownReferences(markdown)).toEqual([]);
  });

  it.each([
    '<div style="background-image:url(/images/private.png)">Private</div>',
    String.raw`<div style="background-image:u\72l(/images/private.png)">Private</div>`,
    '<span style="font-weight: 700">Styled prose</span>',
    '<iframe srcdoc="<img src=/images/private.png>"></iframe>',
    '<iframe src="data:text/html,<img src=https://mldangelo.com/private.png>"></iframe>',
    '<object data="data:text/html,<img src=https://mldangelo.com/private.png>"></object>',
    '<embed src="data:text/html,<img src=https://mldangelo.com/private.png>">',
    '<link rel="stylesheet" href="data:text/css,body{background:url(https://mldangelo.com/private.png)}">',
    '<script src="/scripts/private.js"></script>',
    '<style>.private { background: url(/images/private.png) }</style>',
    '<svg><rect fill="url(/images/private.svg#paint)"></rect></svg>',
    '<svg><image id="i"><set attributeName="href" to="/images/private.png"></set></image></svg>',
    '<base href="/private/">',
    '<meta http-equiv="refresh" content="0;url=/private/">',
  ])('fails closed for an uninspectable raw HTML fetch: %s', (markdown) => {
    expect(() => readMarkdownReferences(markdown)).toThrow(
      /not allowed|cannot be verified/i,
    );
  });

  it('allows embedded raster images but rejects active data documents', () => {
    expect(
      readMarkdownReferences('![pixel](data:image/png;base64,AAAA)'),
    ).toEqual([{ kind: 'image', target: 'data:image/png;base64,AAAA' }]);
    expect(() =>
      readMarkdownReferences(
        '![svg](data:image/svg+xml;base64,PHN2Zz48aW1hZ2UgaHJlZj0iL3ByaXZhdGUucG5nIi8+PC9zdmc+)',
      ),
    ).toThrow(/active data documents/i);
    expect(
      readMarkdownReferences(
        '[page](data:text/html;base64,PGltZyBzcmM9Ii9wcml2YXRlLnBuZyI+)',
      ),
    ).toEqual([]);
  });
});

describe('parseSrcset', () => {
  it('parses density, width, and descriptor-free candidates', () => {
    expect(
      parseSrcset('/one.png 1x, /two.png 2x, /wide.png 960w, /plain.png'),
    ).toEqual(['/one.png', '/two.png', '/wide.png', '/plain.png']);
  });

  it('keeps a described data URL separate from a later local candidate', () => {
    expect(parseSrcset('data:image/png;base64,AAAA 1x, /local.png 2x')).toEqual(
      ['data:image/png;base64,AAAA', '/local.png'],
    );
  });

  it.each([
    '/one.png 1x 2x',
    '/one.png nope',
    '/one.png calc(1x',
    'data:image/png;base64,AAAA, /hidden.png 2x',
  ])('fails closed for malformed or ambiguous srcset: %s', (srcset) => {
    expect(() => parseSrcset(srcset)).toThrow(/srcset/i);
  });
});

import { act, fireEvent, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { planMarkdownHeadingAnchors } from '@/lib/anchors';
import type { ImageSize } from '@/lib/imageSize';
import { withBasePath } from '@/lib/utils';

import PostContent from '../PostContent';

const OG_SIZE: Record<string, ImageSize> = {
  '/og.png': { width: 1200, height: 630 },
};

function markup(content: string, imageSizes = OG_SIZE) {
  return renderToStaticMarkup(
    <PostContent content={content} imageSizes={imageSizes} />,
  );
}

function idsIn(html: string, pattern: RegExp): string[] {
  return Array.from(html.matchAll(pattern), (m) => m[1]);
}

const headingIds = (html: string) => idsIn(html, /<h[1-6][^>]*\bid="([^"]+)"/g);
const aliasIds = (html: string) =>
  idsIn(html, /<span class="prose-anchor-alias" id="([^"]+)"/g);

function expectUniqueIds(html: string) {
  const ids = idsIn(html, /\bid="([^"]+)"/g);
  expect(new Set(ids).size, html).toBe(ids.length);
}

describe('PostContent block structure', () => {
  it('leaves blocks as direct children, where `.prose > *` rules reach them', () => {
    expect(markup('One.\n\nTwo.')).not.toContain('<div>');
  });
});

describe('PostContent image sizing', () => {
  it.each([
    ['a measured local image', '![Alt](/og.png)', {}, '630'],
    [
      'an unpublished draft image',
      '![Alt](/private-draft.png)',
      { allowMissingLocalImages: true },
      '675',
    ],
    ['a remote image', '![Alt](https://example.com/a.png)', {}, '675'],
  ])('reserves space for %s', (_, content, props, height) => {
    const html = renderToStaticMarkup(
      <PostContent content={content} imageSizes={OG_SIZE} {...props} />,
    );

    expect(html).toContain('alt="Alt"');
    expect(html).toContain('width="1200"');
    expect(html).toContain(`height="${height}"`);
  });

  it('refuses to invent dimensions for a local image', () => {
    expect(() =>
      renderToStaticMarkup(<PostContent content="![Missing](/missing.png)" />),
    ).toThrow(
      'Missing measured dimensions for local article image: /missing.png',
    );
  });
});

describe('PostContent figures', () => {
  // The caption is visible copy; a retained title would repeat it as a native
  // tooltip and as the image's accessible description.
  it.each([
    ['standalone', '![Alt](/og.png "Spend: $9,986")', '<img'],
    // The caption reaches an image one level below the promoted node.
    [
      'linked',
      '[![Alt](/og.png "Spend: $9,986")](https://example.com)',
      '<a href="https://example.com">',
    ],
  ])('promotes a %s image title to a caption', (_, image, kept) => {
    const html = markup(`Intro.\n\n${image}\n`);

    expect(html).toContain('<figure');
    expect(html).toContain(kept);
    expect(html).toContain('Spend: $9,986</figcaption>');
    expect(html).not.toContain('title="Spend');
  });

  it('keeps the tooltip on an image that stays inline, with no figure', () => {
    const html = markup(
      'Intro.\n\nInline ![Alt](/og.png "Hover") in a line.\n',
    );

    expect(html).not.toContain('<figure');
    expect(html).toContain('title="Hover"');
  });

  it('hoists a figure out of its paragraph, with no empty caption', () => {
    for (const image of ['![Alt](/og.png)', '![Alt](/og.png "   ")']) {
      const html = markup(`Intro.\n\n${image}\n\nOutro.\n`);

      expect(html).toContain('<figure');
      expect(html).not.toContain('<p><figure');
      expect(html).not.toContain('<figcaption');
      // Lets a wide figure exceed the reading measure.
      expect(html).toContain('--figure-width:1200px');
    }
  });

  it('links a local figure to its file, unless it already links elsewhere', () => {
    const figure = render(
      <PostContent
        content={'Intro.\n\n![Alt](/og.png)\n'}
        imageSizes={OG_SIZE}
      />,
    );
    // Chrome names it "Alt (full size)"; jsdom's name computation drops the space.
    expect(
      figure.getByRole('link', { name: /^Alt\s*\(full size\)$/ }),
    ).toHaveAttribute('href', withBasePath('/og.png'));
    figure.unmount();

    // The authored destination is kept, with no second link inside it.
    const linked = render(
      <PostContent
        content={'Intro.\n\n[![Alt](/og.png)](https://example.com)\n'}
        imageSizes={OG_SIZE}
      />,
    );
    expect(
      linked.getAllByRole('link').map((link) => link.getAttribute('href')),
    ).toEqual(['https://example.com']);
  });

  // A `src` is not an image: promoting one sends it to the build-time sizer,
  // which only measures Markdown image syntax, and `next build` fails.
  it('leaves a standalone raw-HTML embed alone', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n<video src="/demo.mp4"></video>\n'} />,
    );

    expect(html).toContain(`<video src="${withBasePath('/demo.mp4')}"`);
    expect(html).not.toContain('<figure');
  });
});

// Raw HTML in a post renders as its author wrote it.
describe('PostContent raw HTML', () => {
  // Its body is opaque to the Markdown checks, so it renders as text: markup
  // inside it can neither fetch nor run.
  it('keeps a raw code block as text, with its language', () => {
    const html = markup(
      '<pre><code class="language-js" style="background:url(/x.png)">const a = <b>"b"</b> &lt; c;<img src="/private.png"></code></pre>\n',
    );

    expect(html).toContain(
      '<code class="language-js lang-js">const a = &quot;b&quot; &lt; c;</code>',
    );
    expect(html).toContain('js code block');
    expect(html).not.toMatch(/style=|<img|<b>/);
  });

  it('keeps the attributes on a raw paragraph', () => {
    expect(
      markup('<p hidden id="note" lang="fr" dir="rtl">Bonjour</p>\n'),
    ).toMatch(/<p hidden="" id="note" lang="fr" dir="rtl">Bonjour<\/p>/);
  });

  // Copied with curly quotes, `{"ok":true}` no longer parses as JSON.
  it('sets quotes in prose but not in raw code', () => {
    const html = markup('A "quote" and <code>{"ok":true}</code>.\n');

    expect(html).toContain('A \u201cquote\u201d');
    expect(html).toContain('<code>{&quot;ok&quot;:true}</code>');
  });
});

describe('PostContent code fences', () => {
  const FENCE = '```text\nA deliberately long line\n```\n';

  /** Renders a fence whose layout jsdom cannot measure, so the test sets it. */
  function renderFence(content = FENCE) {
    const view = render(<PostContent content={content} />);
    const pre = view.container.querySelector('pre') as HTMLElement;
    const box = { clientWidth: 320, scrollWidth: 640 };

    Object.defineProperties(pre, {
      clientWidth: { configurable: true, get: () => box.clientWidth },
      scrollWidth: { configurable: true, get: () => box.scrollWidth },
    });

    return { ...view, pre, box };
  }

  function resize() {
    act(() => window.dispatchEvent(new Event('resize')));
  }

  it('names a declared language and invents none for an unlabelled fence', () => {
    expect(markup('```bash\nnpm run dev\n```\n')).toContain('bash code block');
    expect(markup('```\nultrathink\n```\n')).not.toContain('code block');
  });

  it('adds no tab stop or landmark during server rendering', () => {
    expect(markup(FENCE)).not.toMatch(/tabindex|role="region"|aria-label/);
  });

  it('adds a tab stop only while the fence overflows', () => {
    const { pre, box } = renderFence();

    resize();
    expect(pre).toHaveAttribute('tabindex', '0');
    expect(pre).not.toHaveAttribute('role');

    box.clientWidth = 640;
    resize();
    expect(pre).not.toHaveAttribute('tabindex');
  });

  it('remeasures when a retained fence receives new code', () => {
    const { pre, box, container, rerender } = renderFence();

    box.scrollWidth = 320;
    resize();
    expect(pre).not.toHaveAttribute('tabindex');

    box.scrollWidth = 640;
    rerender(<PostContent content={'```text\nA replacement line\n```\n'} />);
    expect(container.querySelector('pre')).toBe(pre);
    expect(pre).toHaveAttribute('tabindex', '0');
  });

  it('scrolls with arrow keys but leaves Shift+Arrow to text selection', () => {
    const { pre } = renderFence();

    fireEvent.keyDown(pre, { key: 'ArrowRight' });
    expect(pre.scrollLeft).toBe(40);

    fireEvent.keyDown(pre, { key: 'ArrowLeft' });
    expect(pre.scrollLeft).toBe(0);

    // fireEvent returns false once the handler cancels the default action.
    expect(fireEvent.keyDown(pre, { key: 'ArrowRight', shiftKey: true })).toBe(
      true,
    );
    expect(pre.scrollLeft).toBe(0);
  });
});

describe('PostContent heading anchors', () => {
  // The renderer's own slugifier keeps every separator it strips, which would
  // disagree with the id the rest of the site derives.
  it('slugifies headings with the shared helper', () => {
    expect(
      headingIds(
        markup(
          '## On using `--dangerously-skip-permissions`\n\n## CLAUDE.md + AGENTS.md\n',
        ),
      ),
    ).toEqual(['on-using-dangerously-skip-permissions', 'claude-md-agents-md']);
  });

  it('keeps duplicate ids stable when Strict Mode repeats compilation', () => {
    const { container } = render(
      <StrictMode>
        <PostContent content={'## Repeat\n\n## Repeat\n'} />
      </StrictMode>,
    );

    expect(headingIds(container.innerHTML)).toEqual(['repeat', 'repeat-2']);
  });

  // Headings published in an early post, whose ids the renderer then wrote
  // itself. A heading the two schemes agree on needs no alias.
  it('keeps the legacy ids of published headings resolving as hidden aliases', () => {
    const html = markup(
      [
        '## Context',
        '## On using `--dangerously-skip-permissions`',
        '## Browser automation: `--chrome` for interaction, Playwright MCP for screenshots',
        '## Plan Mode + writing plans to files',
        '## CLAUDE.md + AGENTS.md',
      ].join('\n\n'),
    );

    expect(aliasIds(html).sort()).toEqual([
      'browser-automation---chrome-for-interaction-playwright-mcp-for-screenshots',
      'claudemd--agentsmd',
      'on-using---dangerously-skip-permissions',
      'plan-mode--writing-plans-to-files',
    ]);
  });

  it.each([
    [
      'keeps one alias when a heading with a legacy id repeats',
      '## On using `--dangerously-skip-permissions`\n\n## On using `--dangerously-skip-permissions`\n',
      ['on-using---dangerously-skip-permissions'],
    ],
    [
      'suppresses an alias that would collide with a canonical id',
      '## Node.js\n\n## Nodejs\n',
      [],
    ],
  ])('%s', (_, content, aliases) => {
    const html = markup(content);

    expect(aliasIds(html)).toEqual(aliases);
    expectUniqueIds(html);
  });

  // The outline links to headings the renderer ids on its own, so the two
  // have to agree, duplicates and code spans included.
  it("plans an outline whose ids are the rendered headings'", () => {
    const content =
      '## One\n\nText.\n\n### Under\n\n## One\n\n## The `--flag`\n';
    const { outline } = planMarkdownHeadingAnchors(content);

    expect(outline.map(({ title }) => title)).toEqual([
      'One',
      'One',
      'The --flag',
    ]);
    expect(outline.map(({ id }) => id)).toEqual(
      idsIn(markup(content), /<h2[^>]*\bid="([^"]+)"/g),
    );
  });

  it('keeps raw heading attributes and avoids raw and footnote ids', () => {
    const html = markup(
      '<h2 id="custom" class="special">Raw</h2>\n\n## Custom\n\n[^note]\n\n[^note]: Copy\n\n## note\n',
    );

    expect(html).toContain('<h2 class="special" id="custom">');
    expect(headingIds(html)).toEqual(['custom', 'custom-2', 'note-2']);
    expect(html).toContain('href="#note"');
    expectUniqueIds(html);
  });

  it('leaves footnotes on the slug scheme the renderer pairs them with', () => {
    const html = markup('## foo.bar\n\nText.[^foo.bar]\n\n[^foo.bar]: Copy\n');

    expect(headingIds(html)).toEqual(['foo-bar']);
    expect(html).toContain('href="#foobar"');
    expect(html).toContain('<div id="foobar">');
  });
});

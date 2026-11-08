import { act, fireEvent, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { type ImageSize, readPostImageSizes } from '@/lib/imageSize';
import { getPostBySlug } from '@/lib/posts';

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

  // A `src` is not an image: promoting one sends it to the build-time sizer,
  // which only measures Markdown image syntax, and `next build` fails.
  it('leaves a standalone raw-HTML embed alone', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n<video src="/demo.mp4"></video>\n'} />,
    );

    expect(html).toContain('<video src="/demo.mp4"');
    expect(html).not.toContain('<figure');
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

  it('keeps the legacy ids of a published post resolving as hidden aliases', () => {
    const post = getPostBySlug('shipping-with-claude-code');
    if (!post) {
      throw new Error('expected shipping-with-claude-code to be published');
    }

    const html = markup(post.content, readPostImageSizes(post.content));

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

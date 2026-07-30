import { act, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { createHeadingId } from '@/lib/anchors';
import { readPostImageSizes } from '@/lib/imageSize';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

import PostContent from '../PostContent';

const OG_SIZE = { '/og.png': { width: 1200, height: 630 } };

function headingIds(html: string): string[] {
  return Array.from(html.matchAll(/<h[1-6][^>]*\bid="([^"]+)"/g), (m) => m[1]);
}

function allIds(html: string): string[] {
  return Array.from(html.matchAll(/\bid="([^"]+)"/g), (m) => m[1]);
}

function aliasIds(html: string): string[] {
  return Array.from(
    html.matchAll(/<span class="prose-anchor-alias" id="([^"]+)"/g),
    (m) => m[1],
  );
}

describe('PostContent', () => {
  it('renders measured local images during server rendering', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content="![A social card](/og.png)"
        imageSizes={{ '/og.png': { width: 1200, height: 630 } }}
      />,
    );

    expect(html).toContain('alt="A social card"');
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="630"');
  });

  it('refuses to invent dimensions for a local image', () => {
    expect(() =>
      renderToStaticMarkup(<PostContent content="![Missing](/missing.png)" />),
    ).toThrow(
      'Missing measured dimensions for local article image: /missing.png',
    );
  });

  it('retains a fallback for remote images', () => {
    const html = renderToStaticMarkup(
      <PostContent content="![Remote](https://example.com/image.png)" />,
    );

    expect(html).toContain('width="1200"');
    expect(html).toContain('height="675"');
  });
});

describe('PostContent figures', () => {
  it('promotes the site caption convention while preserving the image title', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n![Alt](/og.png "July API spend: $9,986.20")\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).toContain(
      '<figcaption class="prose-figcaption">July API spend: $9,986.20</figcaption>',
    );
    expect(html).toContain('title="July API spend: $9,986.20"');
    expect(html).toContain('<figure class="prose-figure"');
  });

  it('promotes a standalone image to a figure without emitting one inside a paragraph', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n![Alt](/og.png)\n\nOutro.\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).toContain('<figure class="prose-figure"');
    expect(html).not.toContain('<p><figure');
    expect(html).not.toContain('<figcaption');
  });

  it('keeps a linked image a captioned figure', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          'Intro.\n\n[![Alt](/og.png "8,482 contributions")](https://example.com)\n'
        }
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).toContain('<figure class="prose-figure"');
    expect(html).toContain('<a href="https://example.com">');
    expect(html).toContain('8,482 contributions</figcaption>');
  });

  it('leaves a paragraph that merely contains an image as a paragraph', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\nInline ![Alt](/og.png) inside a sentence.\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).not.toContain('<figure');
    expect(html).toContain('Inline ');
  });

  it('publishes the build-measured width so a wide figure can exceed the reading measure', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n![Wide](/wide.png)\n'}
        imageSizes={{ '/wide.png': { width: 1117, height: 812 } }}
      />,
    );

    expect(html).toContain('--figure-width:1117px');
  });
});

describe('PostContent code fences', () => {
  it('labels a fence with the language it already declares', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n```bash\nnpm run dev\n```\n'} />,
    );

    expect(html).toContain(
      '<span class="prose-fence-lang" aria-hidden="true">bash</span>',
    );
  });

  it('does not add tab stops or landmark regions during server rendering', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '```markdown\n@AGENTS.md\n```\n\n```markdown\n@CLAUDE.md\n```\n'
        }
      />,
    );

    expect(html).not.toContain('tabindex');
    expect(html).not.toContain('role="region"');
    expect(html).not.toContain('aria-label');
  });

  it('adds a tab stop only while the rendered fence actually overflows', () => {
    const { container } = render(
      <PostContent content={'```text\nA deliberately long line\n```\n'} />,
    );
    const pre = container.querySelector('pre');
    if (!pre) {
      throw new Error('expected a rendered code fence');
    }

    let clientWidth = 320;
    let scrollWidth = 640;
    Object.defineProperties(pre, {
      clientWidth: {
        configurable: true,
        get: () => clientWidth,
      },
      scrollWidth: {
        configurable: true,
        get: () => scrollWidth,
      },
    });

    act(() => window.dispatchEvent(new Event('resize')));
    expect(pre).toHaveAttribute('tabindex', '0');
    expect(pre).not.toHaveAttribute('role');

    clientWidth = 640;
    scrollWidth = 640;
    act(() => window.dispatchEvent(new Event('resize')));
    expect(pre).not.toHaveAttribute('tabindex');
  });

  it('does not invent a language plate for an unlabelled fence', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n```\nultrathink: audit this\n```\n'} />,
    );

    expect(html).not.toContain('prose-fence-lang');
  });
});

describe('PostContent heading anchors', () => {
  it('slugifies headings with the shared helper instead of a second scheme', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={
          '## On using `--dangerously-skip-permissions`\n\n## CLAUDE.md + AGENTS.md\n'
        }
      />,
    );

    expect(headingIds(html)).toEqual([
      createHeadingId('On using `--dangerously-skip-permissions`'),
      createHeadingId('CLAUDE.md + AGENTS.md'),
    ]);
    expect(headingIds(html)).toEqual([
      'on-using-dangerously-skip-permissions',
      'claude-md-agents-md',
    ]);
  });

  it('gives normalized duplicate headings deterministic unique ids', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'## Repeat\n\n## Repeat\n\n## Répeat\n\n## !!!\n\n## ???\n'}
      />,
    );

    expect(headingIds(html)).toEqual([
      'repeat',
      'repeat-2',
      'repeat-3',
      'section',
      'section-2',
    ]);
    expect(new Set(allIds(html)).size).toBe(allIds(html).length);
  });

  it('keeps duplicate ids stable when Strict Mode repeats compilation', () => {
    const { container } = render(
      <StrictMode>
        <PostContent content={'## Repeat\n\n## Repeat\n\n## Répeat\n'} />
      </StrictMode>,
    );

    expect(headingIds(container.innerHTML)).toEqual([
      'repeat',
      'repeat-2',
      'repeat-3',
    ]);
  });

  it('emits anchor-clean ids for every heading in every published post', () => {
    for (const post of getAllPosts()) {
      const html = renderToStaticMarkup(
        <PostContent
          content={post.content}
          imageSizes={readPostImageSizes(post.content)}
        />,
      );

      for (const id of headingIds(html)) {
        expect(id, `${post.slug} → ${id}`).toBe(createHeadingId(id));
      }
    }
  });

  it('renders the real post whose headings the two schemes disagreed about', () => {
    const post = getPostBySlug('shipping-with-claude-code');
    if (!post) {
      throw new Error('expected shipping-with-claude-code to be published');
    }

    const html = renderToStaticMarkup(
      <PostContent
        content={post.content}
        imageSizes={readPostImageSizes(post.content)}
      />,
    );

    expect(headingIds(html)).toContain('on-using-dangerously-skip-permissions');
    expect(headingIds(html)).toContain('claude-md-agents-md');
    expect(headingIds(html)).not.toContain(
      'on-using---dangerously-skip-permissions',
    );
  });

  it('keeps the previously published ids resolving as hidden aliases', () => {
    const post = getPostBySlug('shipping-with-claude-code');
    if (!post) {
      throw new Error('expected shipping-with-claude-code to be published');
    }

    const html = renderToStaticMarkup(
      <PostContent
        content={post.content}
        imageSizes={readPostImageSizes(post.content)}
      />,
    );

    expect(aliasIds(html).sort()).toEqual(
      [
        'browser-automation---chrome-for-interaction-playwright-mcp-for-screenshots',
        'claudemd--agentsmd',
        'on-using---dangerously-skip-permissions',
        'plan-mode--writing-plans-to-files',
      ].sort(),
    );
    expect(new Set(allIds(html)).size).toBe(allIds(html).length);
  });

  it('suppresses a legacy alias that would collide with another canonical id', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'## Node.js\n\n## Nodejs\n'} />,
    );

    expect(headingIds(html)).toEqual(['node-js', 'nodejs']);
    expect(aliasIds(html)).toEqual([]);
  });

  it('emits no duplicate ids in any published post', () => {
    for (const post of getAllPosts()) {
      const html = renderToStaticMarkup(
        <PostContent
          content={post.content}
          imageSizes={readPostImageSizes(post.content)}
        />,
      );
      const ids = allIds(html);

      expect(new Set(ids).size, post.slug).toBe(ids.length);
    }
  });
});

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
  it('renders a CommonMark image title as a real figcaption', () => {
    const html = renderToStaticMarkup(
      <PostContent
        content={'Intro.\n\n![Alt](/og.png "July API spend: $9,986.20")\n'}
        imageSizes={OG_SIZE}
      />,
    );

    expect(html).toContain(
      '<figcaption class="prose-figcaption">July API spend: $9,986.20</figcaption>',
    );
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

  it('makes the fence a focusable scroll region with an accessible name', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n```markdown\n@AGENTS.md\n```\n'} />,
    );

    expect(html).toContain('tabindex="0"');
    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="markdown code block"');
  });

  it('names an unlabelled fence without inventing a language plate', () => {
    const html = renderToStaticMarkup(
      <PostContent content={'Intro.\n\n```\nultrathink: audit this\n```\n'} />,
    );

    expect(html).toContain('aria-label="Code block"');
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
});

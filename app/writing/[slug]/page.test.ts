import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AUTHOR_NAME, SHARE_IMAGE_DIMENSIONS, SITE_URL } from '@/lib/utils';

import PostPage, { generateMetadata } from './page';

/** The BlogPosting node the rendered page publishes as JSON-LD. */
async function blogPostingFor(slug: string) {
  const markup = renderToStaticMarkup(
    await PostPage({ params: Promise.resolve({ slug }) }),
  );
  const graph = JSON.parse(
    markup.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1] ?? '{}',
  );

  return graph['@graph']?.find(
    (node: { '@type': string }) => node['@type'] === 'BlogPosting',
  );
}

describe('writing post metadata', () => {
  it('uses a trailing-slash canonical URL for posts', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'claude-code-outage' }),
    });

    expect(metadata.openGraph?.url).toBe(
      `${SITE_URL}/writing/claude-code-outage/`,
    );
  });

  /**
   * The share image is the post's own generated card, even when the post names
   * an article image. `summary_large_image` wants 1200x630, and a screenshot is
   * whatever shape it happens to be — this one is 1117x812.
   */
  it('uses the generated post card for social metadata', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'shipping-with-claude-code' }),
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${SITE_URL}/og/writing/shipping-with-claude-code.png`,
        width: SHARE_IMAGE_DIMENSIONS.width,
        height: SHARE_IMAGE_DIMENSIONS.height,
        alt: `What I learned shipping 1,000+ PRs with Claude Code — ${AUTHOR_NAME}`,
      },
    ]);
    expect(metadata.twitter?.images).toEqual(metadata.openGraph?.images);
  });
});

describe('writing post structured data', () => {
  /**
   * An explicitly selected article image is not thrown away by the card: it
   * moves to the JSON-LD `image`, which is where a representative screenshot
   * belongs and where its real dimensions are wanted.
   */
  it('keeps an explicitly selected article image in the BlogPosting', async () => {
    const blogPosting = await blogPostingFor('shipping-with-claude-code');

    expect(blogPosting.image).toMatchObject({
      url: `${SITE_URL}/images/writing/api-costs-july-2025.png`,
      width: 1117,
      height: 812,
      caption:
        'Anthropic API costs for July 2025 showing $9,986.20 in token usage',
    });
  });

  it('falls back to the post card for a post with no article image', async () => {
    const blogPosting = await blogPostingFor('claude-code-outage');

    expect(blogPosting.image).toMatchObject({
      url: `${SITE_URL}/og/writing/claude-code-outage.png`,
      width: SHARE_IMAGE_DIMENSIONS.width,
      height: SHARE_IMAGE_DIMENSIONS.height,
    });
  });
});

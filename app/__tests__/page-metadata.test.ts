import { describe, expect, it } from 'vitest';

import { sharedOpenGraph } from '@/lib/metadata';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { RESUME_JSON_URL } from '@/lib/resumeJson';
import {
  AUTHOR_NAME,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/utils';
import { metadata as aboutMetadata } from '../about/page';
import { metadata as contactMetadata } from '../contact/page';
import { metadata as notFoundMetadata } from '../not-found';
import { metadata as projectsMetadata } from '../projects/page';
import { metadata as resumeMetadata } from '../resume/page';
import { metadata as speakingMetadata } from '../speaking/page';
import { metadata as statsMetadata } from '../stats/page';
import { generateMetadata as generatePostMetadata } from '../writing/[slug]/page';
import { metadata as writingMetadata } from '../writing/page';

/**
 * Next replaces a route's `openGraph`, `twitter`, and `alternates` objects
 * rather than merging them, so anything a route omits vanishes from that page.
 */
const sharedFields = { siteName: sharedOpenGraph?.siteName, locale: 'en_US' };
const sharedTwitterFields = {
  card: 'summary_large_image',
  site: TWITTER_HANDLE,
  creator: TWITTER_HANDLE,
};

describe('page metadata', () => {
  it.each([
    ['about', aboutMetadata, '/about/'],
    ['contact', contactMetadata, '/contact/'],
    ['projects', projectsMetadata, '/projects/'],
    ['resume', resumeMetadata, '/resume/'],
    ['speaking', speakingMetadata, '/speaking/'],
    ['stats', statsMetadata, '/stats/'],
    ['writing', writingMetadata, '/writing/'],
    ['404', notFoundMetadata, undefined],
  ])('%s restates what a replacing object drops', (_, metadata, path) => {
    const url = path && `${SITE_URL}${path}`;
    const share = {
      title: `${metadata.title} | ${AUTHOR_NAME}`,
      description: metadata.description,
    };

    // The 404 has no stable canonical URL in a static export.
    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph?.url).toBe(url);
    expect(metadata.openGraph).toMatchObject({ ...sharedFields, ...share });
    expect(metadata.twitter).toMatchObject({
      ...sharedTwitterFields,
      ...share,
    });
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      SHARE_IMAGE_PATH,
    );
    expect(JSON.stringify(metadata.twitter?.images)).toContain(
      SHARE_IMAGE_PATH,
    );
  });

  it.each([
    ['writing', writingMetadata, { 'application/rss+xml': '/feed.xml' }],
    ['resume', resumeMetadata, { 'application/json': RESUME_JSON_URL }],
  ])('%s declares its alternate beside the canonical', (_, metadata, types) => {
    expect(metadata.alternates?.types).toEqual(types);
    expect(metadata.alternates?.canonical).toBeTruthy();
  });

  // A post declares the card generated for it rather than the site card, so a
  // shared essay does not look like a shared homepage. A post's own `image` is
  // for JSON-LD, because it is not the shape `summary_large_image` wants.
  it.each(getPostSlugs())('%s keeps a share card of its own', async (slug) => {
    const metadata = await generatePostMetadata({
      params: Promise.resolve({ slug }),
    });

    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/writing/${slug}/`);
    expect(metadata.openGraph).toMatchObject(sharedFields);
    expect(metadata.twitter).toMatchObject(sharedTwitterFields);
    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${SITE_URL}/og/writing/${slug}.png`,
        width: SHARE_IMAGE_DIMENSIONS.width,
        height: SHARE_IMAGE_DIMENSIONS.height,
        alt: `${getPostBySlug(slug)?.title} — ${AUTHOR_NAME}`,
      },
    ]);
    expect(metadata.twitter?.images).toEqual(metadata.openGraph?.images);
  });
});

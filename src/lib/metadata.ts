import type { Metadata } from 'next';

import profile from '@/data/profile.json';
import {
  AUTHOR_NAME,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_URL,
  TWITTER_HANDLE,
} from './utils';

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: `/${string}`;
}

/**
 * The share card is a fixed design that does not render the page title, so
 * the alt text describes the card rather than claiming the title appears in
 * the image. Role and employer come from the profile so they change in one
 * place, just as the stats page and OG script read shared profile facts.
 */
export const SHARE_IMAGE_ALT = `${AUTHOR_NAME} — ${profile.role} at ${profile.employer}`;

/**
 * The OpenGraph and Twitter blocks every page needs.
 *
 * A route-level `openGraph` object replaces the inherited one wholesale
 * rather than merging, so anything omitted here vanishes from that page.
 * Callers that build their own metadata (blog posts) should spread these.
 */
export const sharedOpenGraph: Metadata['openGraph'] = {
  locale: 'en_US',
  siteName: AUTHOR_NAME,
  images: [
    {
      url: SHARE_IMAGE_PATH,
      width: SHARE_IMAGE_DIMENSIONS.width,
      height: SHARE_IMAGE_DIMENSIONS.height,
      alt: SHARE_IMAGE_ALT,
    },
  ],
};

export const sharedTwitter: Metadata['twitter'] = {
  card: 'summary_large_image',
  site: TWITTER_HANDLE,
  creator: TWITTER_HANDLE,
  images: [SHARE_IMAGE_PATH],
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const absoluteUrl = path ? new URL(path, SITE_URL).toString() : undefined;
  const pageTitle = `${title} | ${AUTHOR_NAME}`;

  return {
    title,
    description,
    // Canonical is emitted wherever the page has a stable URL. `not-found`
    // passes no path, because a 404 has no canonical route in a static export.
    ...(absoluteUrl ? { alternates: { canonical: absoluteUrl } } : {}),
    openGraph: {
      ...sharedOpenGraph,
      type: 'website',
      title: pageTitle,
      description,
      ...(absoluteUrl ? { url: absoluteUrl } : {}),
    },
    twitter: {
      ...sharedTwitter,
      title: pageTitle,
      description,
    },
  };
}

import type { Metadata } from 'next';

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

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const absoluteUrl = path ? new URL(path, SITE_URL).toString() : undefined;
  const pageTitle = `${title} | ${AUTHOR_NAME}`;

  // Images are set explicitly on every page: a route-level `openGraph` object
  // replaces the inherited one entirely, so anything left implicit here simply
  // disappears from subpages.
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: AUTHOR_NAME,
      title: pageTitle,
      description,
      ...(absoluteUrl ? { url: absoluteUrl } : {}),
      images: [
        {
          url: SHARE_IMAGE_PATH,
          width: SHARE_IMAGE_DIMENSIONS.width,
          height: SHARE_IMAGE_DIMENSIONS.height,
          alt: `${AUTHOR_NAME} — ${title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: pageTitle,
      description,
      images: [SHARE_IMAGE_PATH],
    },
  };
}

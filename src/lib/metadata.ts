import type { Metadata } from 'next';

import { AUTHOR_NAME, SITE_URL, TWITTER_HANDLE } from './utils';

interface PageMetadataOptions {
  title: string;
  description: string;
  path: `/${string}`;
}

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const absoluteUrl = `${SITE_URL}${path}`;
  const pageTitle = `${title} | ${AUTHOR_NAME}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: absoluteUrl,
      siteName: AUTHOR_NAME,
      title: pageTitle,
      description,
      images: [
        {
          url: '/images/me.jpg',
          width: 1200,
          height: 630,
          alt: AUTHOR_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: pageTitle,
      description,
      images: ['/images/me.jpg'],
    },
  };
}

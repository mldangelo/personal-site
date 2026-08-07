import type { Metadata } from 'next';
import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE_PATH,
  SITE_NAME,
  TWITTER_HANDLE
} from '@/lib/site';

interface PageMetadataOptions {
  /** Page title, slotted into the `%s | Austin Dase` template. Omit for the root. */
  title?: string;
  description?: string;
  /** Route path, e.g. '/about'. Becomes the canonical and the og:url. */
  path: string;
  /** Alt text for the social card image. */
  imageAlt?: string;
  /** Overrides the title used on social cards only. */
  socialTitle?: string;
  card?: 'summary' | 'summary_large_image';
  noindex?: boolean;
}

/**
 * Builds a page's Metadata from the shared social defaults.
 *
 * Next replaces the whole `openGraph` / `twitter` object when a page declares
 * one — it does not deep-merge — so a page that set only `images` silently
 * dropped `og:type`, `og:site_name`, and the Twitter handles. Composing them
 * here keeps every route complete and stops each page from restating the
 * image path.
 */
export const pageMetadata = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  imageAlt = `${SITE_NAME} website social preview`,
  socialTitle,
  card = 'summary_large_image',
  noindex = false
}: PageMetadataOptions): Metadata => {
  const cardTitle =
    socialTitle ?? (title ? `${title} | ${SITE_NAME}` : SITE_NAME);

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: path,
      title: cardTitle,
      description,
      images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: imageAlt }]
    },
    twitter: {
      card,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: cardTitle,
      description,
      images: [OG_IMAGE_PATH]
    }
  };
};

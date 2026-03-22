import { describe, expect, it } from 'vitest';

import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';
import { metadata as aboutMetadata } from '../about/page';
import { metadata as contactMetadata } from '../contact/page';
import { metadata as notFoundMetadata } from '../not-found';
import { metadata as projectsMetadata } from '../projects/page';
import { metadata as resumeMetadata } from '../resume/page';
import { metadata as statsMetadata } from '../stats/page';
import { metadata as writingMetadata } from '../writing/page';

describe('page metadata', () => {
  it.each([
    ['about', aboutMetadata, `${SITE_URL}/about/`],
    ['contact', contactMetadata, `${SITE_URL}/contact/`],
    ['archive', projectsMetadata, `${SITE_URL}/projects/`],
    ['resume', resumeMetadata, `${SITE_URL}/resume/`],
    ['stats', statsMetadata, `${SITE_URL}/stats/`],
    ['writing', writingMetadata, `${SITE_URL}/writing/`],
  ])('sets page-specific open graph metadata for %s', (_, metadata, url) => {
    expect(metadata.openGraph?.url).toBe(url);
    expect(metadata.openGraph?.description).toBe(metadata.description);
    expect(metadata.openGraph?.title).toBe(
      `${metadata.title} | ${AUTHOR_NAME}`,
    );
  });

  it.each([
    ['about', aboutMetadata],
    ['contact', contactMetadata],
    ['archive', projectsMetadata],
    ['resume', resumeMetadata],
    ['stats', statsMetadata],
    ['writing', writingMetadata],
  ])('sets page-specific twitter metadata for %s', (_, metadata) => {
    expect(metadata.twitter?.description).toBe(metadata.description);
    expect(metadata.twitter?.title).toBe(`${metadata.title} | ${AUTHOR_NAME}`);
  });

  it('overrides 404 share metadata without inventing a canonical url', () => {
    expect(notFoundMetadata.openGraph?.url).toBeUndefined();
    expect(notFoundMetadata.openGraph?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.openGraph?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
    expect(notFoundMetadata.twitter?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.twitter?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
  });

  it('preserves the writing rss alternate', () => {
    expect(writingMetadata.alternates?.types?.['application/rss+xml']).toBe(
      '/feed.xml',
    );
  });
});

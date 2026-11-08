import type { MetadataRoute } from 'next';

import routes from '@/data/routes';
import { getAllPosts } from '@/lib/posts';
import { canonicalPostUrl, SITE_URL } from '@/lib/utils';

export const dynamic = 'force-static';

type CrawlHints = Pick<
  MetadataRoute.Sitemap[number],
  'changeFrequency' | 'priority'
>;

/** A page is monthly at 0.8 unless it is listed here. */
const CRAWL_HINTS: Record<string, CrawlHints> = {
  '/': { priority: 1 },
  '/writing': { changeFrequency: 'weekly' },
  '/speaking': { priority: 0.7 },
  '/stats': { changeFrequency: 'weekly', priority: 0.5 },
  '/contact': { changeFrequency: 'yearly', priority: 0.5 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = routes.map(({ path }) => ({
    // `trailingSlash: true` exports every page as a directory.
    url: `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`,
    changeFrequency: 'monthly',
    priority: 0.8,
    ...CRAWL_HINTS[path],
  }));
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: canonicalPostUrl(post.slug),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...posts];
}

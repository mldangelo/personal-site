import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/utils';

export const dynamic = 'force-static';

/** Generated so the sitemap's address follows `homepage` like every other URL. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

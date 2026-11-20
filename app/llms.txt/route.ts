import type { Metadata } from 'next';

import routes from '@/data/routes';
import { RESUME_JSON_URL } from '@/lib/resumeJson';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';
import { getWritingItems } from '@/lib/writing';
import { metadata as about } from '../about/page';
import { metadata as contact } from '../contact/page';
import { metadata as projects } from '../projects/page';
import { metadata as resume } from '../resume/page';
import { metadata as speaking } from '../speaking/page';
import { metadata as stats } from '../stats/page';
import { metadata as writing } from '../writing/page';

export const dynamic = 'force-static';

/** Each page's own description, so this file says what the page says. */
const PAGES: Record<string, Metadata> = {
  '/about': about,
  '/contact': contact,
  '/projects': projects,
  '/resume': resume,
  '/speaking': speaking,
  '/stats': stats,
  '/writing': writing,
};

/** Link text in Markdown: brackets would end it early. */
function linkText(text: string): string {
  return text.replace(/[[\]]/g, '\\$&');
}

function entry(title: string, url: string, description?: string | null) {
  const note = description?.replace(/\s+/g, ' ').trim();
  return `- [${linkText(title)}](${url})${note ? `: ${note}` : ''}`;
}

/**
 * The site as Markdown for language models, in the llms.txt format
 * (https://llmstxt.org): a title, a summary, then sections of links. Built
 * from the routes, the pages' metadata, and the writing list, like the feed.
 */
export function GET() {
  const pages = routes
    .filter((route) => !route.index)
    .map((route) => {
      const description = PAGES[route.path]?.description;
      // A new route needs its metadata above, or it would be listed bare.
      if (!description) {
        throw new Error(`llms.txt has no description for ${route.path}`);
      }
      return entry(route.label, `${SITE_URL}${route.path}/`, description);
    });

  const items = getWritingItems();
  const posts = items
    .filter((item) => !item.isExternal)
    .map((item) =>
      entry(item.title, `${SITE_URL}${item.url}`, item.description),
    );
  const elsewhere = items
    .filter((item) => item.isExternal)
    .map((item) => entry(item.title, item.url, item.description));

  const body = `# ${AUTHOR_NAME}

> ${SITE_DESCRIPTION}

Every page is static HTML. The résumé is also published as JSON Resume, and the writing as an RSS feed.

## Pages

${pages.join('\n')}

## Writing

${posts.join('\n')}

## Data

${entry('Résumé as JSON Resume', RESUME_JSON_URL, 'The résumé in the JSON Resume v1.0.0 schema')}
${entry('RSS feed', `${SITE_URL}/feed.xml`, 'Posts and articles, newest first')}
${entry('Sitemap', `${SITE_URL}/sitemap.xml`)}

## Optional

${elsewhere.join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

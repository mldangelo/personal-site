import { WRITING_DESCRIPTION } from '@/lib/schema';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';
import { getWritingItems } from '@/lib/writing';

export const dynamic = 'force-static';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00Z`).toUTCString();
}

export async function GET() {
  // The newest-first list `/writing` shows, less the undated guides: an RSS
  // item is dated, and its link is absolute.
  const items = getWritingItems()
    .filter((item) => item.date)
    .map((item) => ({
      ...item,
      url: item.isExternal ? item.url : `${SITE_URL}${item.url}`,
    }));

  const rssItems = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${formatRssDate(item.date)}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
    </item>`,
    )
    .join('');
  const lastBuildDate = items[0]?.date
    ? formatRssDate(items[0].date)
    : new Date(0).toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(AUTHOR_NAME)} - Writing</title>
    <link>${SITE_URL}/writing/</link>
    <description>${escapeXml(WRITING_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

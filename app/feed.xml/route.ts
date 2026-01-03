import writing from '@/data/writing';

export const dynamic = 'force-static';

const baseUrl = 'https://mldangelo.com';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(`${dateStr}T12:00:00Z`);
  return date.toUTCString();
}

export async function GET() {
  const items = writing
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Michael D'Angelo - Writing</title>
    <link>${baseUrl}/writing</link>
    <description>Articles on AI security, LLM red teaming, and trust &amp; safety by Michael D'Angelo.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

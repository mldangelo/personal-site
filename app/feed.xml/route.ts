import profile from '@/data/profile';
import writing from '@/data/writing';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

const baseUrl = profile.url;

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

interface FeedItem {
  title: string;
  url: string;
  date: string;
  description: string;
}

export async function GET() {
  // Get internal posts
  const internalPosts = getAllPosts();
  const internalItems: FeedItem[] = internalPosts.map((post) => ({
    title: post.title,
    url: `${baseUrl}/writing/${post.slug}`,
    date: post.date,
    description: post.description,
  }));

  // Get external articles
  const externalItems: FeedItem[] = writing
    .filter((item) => item.date)
    .map((item) => ({
      title: item.title,
      url: item.url,
      date: item.date,
      description: item.description,
    }));

  // Merge and sort
  const items = [...internalItems, ...externalItems]
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

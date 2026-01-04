import type { Metadata } from 'next';
import Link from 'next/link';
import PageWrapper from '@/components/Template/PageWrapper';
import writing from '@/data/writing';
import { getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Articles on AI security, LLM red teaming, and trust & safety.',
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

interface UnifiedItem {
  title: string;
  url: string;
  date: string;
  description: string;
  isExternal: boolean;
}

// Extracted component to reduce duplication
interface WritingItemProps {
  item: UnifiedItem;
  showDate?: boolean;
}

function WritingItem({ item, showDate = true }: WritingItemProps) {
  const content = (
    <>
      {showDate && item.date && (
        <time className="writing-date" dateTime={item.date}>
          {formatDate(item.date)}
        </time>
      )}
      <h2 className="writing-title">{item.title}</h2>
      <p className="writing-description">{item.description}</p>
      {item.isExternal && (
        <span className="writing-external" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="writing-item"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.url} className="writing-item">
      {content}
    </Link>
  );
}

export default function WritingPage() {
  // Get internal posts from markdown files
  const internalPosts = getAllPosts();
  const internalItems: UnifiedItem[] = internalPosts.map((post) => ({
    title: post.title,
    url: `/writing/${post.slug}`,
    date: post.date,
    description: post.description,
    isExternal: false,
  }));

  // Get external articles from data file
  const externalItems: UnifiedItem[] = writing.map((item) => ({
    ...item,
    isExternal: true,
  }));

  // Merge and sort all items
  const allItems = [...internalItems, ...externalItems];
  const dated = allItems
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const undated = allItems.filter((item) => !item.date);

  return (
    <PageWrapper>
      <article className="writing-page">
        <header className="writing-header">
          <div className="writing-header-row">
            <h1 className="page-title">Writing</h1>
            <a
              href="/feed.xml"
              className="writing-rss-link"
              title="RSS Feed"
              aria-label="RSS Feed"
            >
              RSS
            </a>
          </div>
        </header>

        <div className="writing-list">
          {dated.map((item) => (
            <WritingItem key={item.url} item={item} />
          ))}

          {undated.length > 0 && (
            <>
              <div className="writing-section-label">Guides</div>
              {undated.map((item) => (
                <WritingItem key={item.url} item={item} showDate={false} />
              ))}
            </>
          )}
        </div>
      </article>
    </PageWrapper>
  );
}

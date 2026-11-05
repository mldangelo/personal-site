import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import {
  blogNode,
  collectionPageNode,
  sectionPageNodes,
  WRITING_DESCRIPTION,
} from '@/lib/schema';
import { smartQuotes } from '@/lib/typography';
import { formatDate } from '@/lib/utils';
import { getWritingItems, type WritingItem as Item } from '@/lib/writing';

const writingMetadata = createPageMetadata({
  title: 'Writing',
  description: WRITING_DESCRIPTION,
  path: '/writing/',
});

export const metadata: Metadata = {
  ...writingMetadata,
  // Spread rather than replace: `alternates` also carries the canonical, and
  // overwriting the whole object dropped it from this page.
  alternates: {
    ...writingMetadata.alternates,
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

function WritingItem({ featured, item }: { featured: boolean; item: Item }) {
  const content = (
    <>
      <div className="writing-meta">
        {item.date && (
          <time className="writing-date" dateTime={item.date}>
            {formatDate(item.date)}
          </time>
        )}
        {item.isExternal && (
          <span className="writing-source">
            {item.source}
            <span className="writing-external" aria-hidden="true">
              ↗
            </span>
          </span>
        )}
      </div>
      <h3 className="writing-title">{smartQuotes(item.title)}</h3>
      <p className="writing-description">{smartQuotes(item.description)}</p>
      {item.isExternal && (
        // The arrow is decorative, so the warning has to be spoken.
        <span className="sr-only"> (opens in a new tab)</span>
      )}
    </>
  );

  const className = `writing-item${featured ? ' writing-item--featured' : ''}`;

  if (item.isExternal) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.url} className={className}>
      {content}
    </Link>
  );
}

export default function WritingPage() {
  const allItems = getWritingItems();
  const latestDatedItem = allItems.find((item) => item.date);
  const [page, breadcrumb] = sectionPageNodes(
    collectionPageNode,
    '/writing/',
    'Writing',
    WRITING_DESCRIPTION,
  );
  const sections = [
    {
      id: 'writing-here',
      label: 'Essays on this site',
      items: allItems.filter((item) => !item.isExternal),
    },
    {
      id: 'writing-elsewhere',
      label: 'Selected writing elsewhere',
      items: allItems.filter((item) => item.isExternal && item.date),
    },
    {
      id: 'writing-guides',
      label: 'Guides',
      items: allItems.filter((item) => item.isExternal && !item.date),
    },
  ];

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[page, blogNode(latestDatedItem?.date), breadcrumb]}
      />
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

        {sections
          .filter(({ items }) => items.length > 0)
          .map(({ id, label, items }) => (
            <section className="writing-group" aria-labelledby={id} key={id}>
              <h2 id={id} className="writing-section-label">
                {label}
              </h2>
              <div className="writing-list">
                {items.map((item) => (
                  <WritingItem
                    key={item.url}
                    item={item}
                    featured={item.url === latestDatedItem?.url}
                  />
                ))}
              </div>
            </section>
          ))}
      </article>
    </PageWrapper>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import {
  blogNode,
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  SITE_URL,
  WRITING_DESCRIPTION,
} from '@/lib/schema';
import { formatDate } from '@/lib/utils';
import { getWritingItems, type WritingItem as Item } from '@/lib/writing';

const WRITING_URL = `${SITE_URL}/writing/`;

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

interface WritingItemProps {
  featured?: boolean;
  item: Item;
  showDate?: boolean;
}

function WritingItem({
  featured = false,
  item,
  showDate = true,
}: WritingItemProps) {
  const content = (
    <>
      <div className="writing-meta">
        {showDate && item.date && (
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
      <h3 className="writing-title">{item.title}</h3>
      <p className="writing-description">{item.description}</p>
      {item.isExternal && (
        // The arrow is decorative, so the warning has to be spoken.
        <span className="sr-only"> (opens in a new tab)</span>
      )}
    </>
  );

  const className = ['writing-item', featured ? 'writing-item--featured' : '']
    .filter(Boolean)
    .join(' ');

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
  const internal = allItems.filter((item) => !item.isExternal);
  const external = allItems.filter((item) => item.isExternal && item.date);
  const guides = allItems.filter((item) => item.isExternal && !item.date);

  const latestDatedItem = allItems.find((item) => item.date);
  const latestPostDate = latestDatedItem?.date;

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: WRITING_URL,
            name: 'Writing',
            description: WRITING_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          blogNode(latestPostDate),
          breadcrumbNode(WRITING_URL, [
            { name: 'Home', url: HOME_URL },
            { name: 'Writing', url: WRITING_URL },
          ]),
        ]}
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

        <section className="writing-group" aria-labelledby="writing-here">
          <h2 id="writing-here" className="writing-section-label">
            Essays on this site
          </h2>
          <div className="writing-list">
            {internal.map((item) => (
              <WritingItem
                key={item.url}
                item={item}
                featured={item.url === latestDatedItem?.url}
              />
            ))}
          </div>
        </section>

        <section className="writing-group" aria-labelledby="writing-elsewhere">
          <h2 id="writing-elsewhere" className="writing-section-label">
            Selected writing elsewhere
          </h2>
          <div className="writing-list">
            {external.map((item) => (
              <WritingItem
                key={item.url}
                item={item}
                featured={item.url === latestDatedItem?.url}
              />
            ))}
          </div>
        </section>

        {guides.length > 0 && (
          <section className="writing-group" aria-labelledby="writing-guides">
            <h2 id="writing-guides" className="writing-section-label">
              Guides
            </h2>
            <div className="writing-list">
              {guides.map((item) => (
                <WritingItem key={item.url} item={item} showDate={false} />
              ))}
            </div>
          </section>
        )}
      </article>
    </PageWrapper>
  );
}

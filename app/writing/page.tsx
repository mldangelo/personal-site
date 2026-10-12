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
import { smartQuotes } from '@/lib/typography';
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
}

/**
 * One row of the index: provenance in the gutter, then the title and a line
 * of supporting copy. An entry with no date simply has none to show, so its
 * source is the whole of its gutter.
 */
function WritingItem({ featured = false, item }: WritingItemProps) {
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
  // Undated entries already sort last, so a guide with no date closes this
  // list. It used to get a section to itself: a heading over a single link.
  const external = allItems.filter((item) => item.isExternal);

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
          <div className="section-header">
            <h2 id="writing-here" className="section-heading">
              Essays on this site
            </h2>
          </div>
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
          <div className="section-header">
            <h2 id="writing-elsewhere" className="section-heading">
              Selected writing elsewhere
            </h2>
          </div>
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
      </article>
    </PageWrapper>
  );
}

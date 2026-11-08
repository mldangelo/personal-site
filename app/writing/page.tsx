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

/**
 * One row of the writing register: the same row as /projects and /speaking,
 * with the date and source in the gutter and the title in the reading face.
 */
function WritingItem({ item }: { item: Item }) {
  const content = (
    <>
      <div className="project-entry-meta">
        {item.date && (
          <time className="project-dates" dateTime={item.date}>
            {formatDate(item.date)}
          </time>
        )}
        {item.isExternal && (
          <span className="project-entry-role">{item.source}</span>
        )}
      </div>
      <div className="project-entry-body">
        <h3 className="project-entry-title">
          {smartQuotes(item.title)}
          {item.isExternal && (
            <span className="project-entry-external" aria-hidden="true">
              ↗
            </span>
          )}
        </h3>
        <p className="project-entry-desc">{smartQuotes(item.description)}</p>
        {item.isExternal && (
          // The arrow is decorative, so the warning has to be spoken.
          <span className="sr-only"> (opens in a new tab)</span>
        )}
      </div>
    </>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="project-entry"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.url} className="project-entry">
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
        <header className="page-header">
          <h1 className="page-title">Writing</h1>
          <a
            href="/feed.xml"
            className="button button-secondary button-compact writing-rss-link"
          >
            RSS
          </a>
        </header>

        {sections
          .filter(({ items }) => items.length > 0)
          .map(({ id, label, items }) => (
            <section className="projects-group" aria-labelledby={id} key={id}>
              <div className="section-header">
                <h2 id={id} className="section-heading">
                  {label}
                </h2>
              </div>
              <ol className="projects-register">
                {items.map((item) => (
                  <li key={item.url}>
                    <WritingItem item={item} />
                  </li>
                ))}
              </ol>
            </section>
          ))}
      </article>
    </PageWrapper>
  );
}

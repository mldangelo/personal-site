import type { Metadata } from 'next';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import Entry from '@/components/Writing/Entry';
import { createPageMetadata } from '@/lib/metadata';
import {
  blogNode,
  collectionPageNode,
  sectionPageNodes,
  WRITING_DESCRIPTION,
} from '@/lib/schema';
import { getWritingItems } from '@/lib/writing';

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
                    <Entry item={item} />
                  </li>
                ))}
              </ol>
            </section>
          ))}
      </article>
    </PageWrapper>
  );
}

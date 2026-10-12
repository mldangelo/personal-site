import type { Metadata } from 'next';
import Link from 'next/link';

import { SchemaGraph } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import { HOME_URL, profilePageNode } from '@/lib/schema';
import { smartQuotes } from '@/lib/typography';
import {
  AUTHOR_NAME,
  formatDate,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/lib/utils';
import { getWritingItems } from '@/lib/writing';

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  // The homepage builds its openGraph in the root layout, so it only needs
  // the canonical here. `trailingSlash: true` makes `/` the canonical form.
  alternates: { canonical: `${SITE_URL}/` },
};

export default function HomePage() {
  const recentWriting = getWritingItems()
    .filter((item) => item.date)
    .slice(0, 3);

  return (
    <PageWrapper mainClassName="page-main--hero">
      <SchemaGraph
        nodes={[profilePageNode({ url: HOME_URL, name: AUTHOR_NAME })]}
      />
      <Hero />
      <section className="home-writing" aria-labelledby="home-writing-title">
        <div className="home-writing-header">
          <h2 id="home-writing-title">Notes &amp; essays</h2>
          <Link href="/writing/" className="home-writing-all">
            All writing <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="home-writing-list">
          {recentWriting.map((item) => {
            const content = (
              <>
                <span className="home-writing-meta">
                  <time dateTime={item.date}>{formatDate(item.date)}</time> ·{' '}
                  {item.source}
                </span>
                <div className="home-writing-copy">
                  <h3>{smartQuotes(item.title)}</h3>
                </div>
                {/* The arrow follows the destination: ↗ leaves the site in a
                    new tab, → stays on it. */}
                <span className="home-writing-arrow" aria-hidden="true">
                  {item.isExternal ? '↗' : '→'}
                </span>
              </>
            );

            return item.isExternal ? (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="home-writing-item"
              >
                {content}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link
                key={item.url}
                href={item.url}
                className="home-writing-item"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </PageWrapper>
  );
}

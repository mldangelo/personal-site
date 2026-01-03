import type { Metadata } from 'next';
import Link from 'next/link';

import writing from '@/data/writing';
import { getAllPosts } from '@/lib/posts';

import PageWrapper from '../components/PageWrapper';

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

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  // Parse as UTC to avoid timezone shifts
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

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
          {dated.map((item) =>
            item.isExternal ? (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="writing-item"
              >
                <time className="writing-date">{formatDate(item.date)}</time>
                <h2 className="writing-title">{item.title}</h2>
                <p className="writing-description">{item.description}</p>
                <span className="writing-external" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : (
              <Link key={item.url} href={item.url} className="writing-item">
                <time className="writing-date">{formatDate(item.date)}</time>
                <h2 className="writing-title">{item.title}</h2>
                <p className="writing-description">{item.description}</p>
              </Link>
            ),
          )}

          {undated.length > 0 && (
            <>
              <div className="writing-section-label">Guides</div>
              {undated.map((item) =>
                item.isExternal ? (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="writing-item"
                  >
                    <h2 className="writing-title">{item.title}</h2>
                    <p className="writing-description">{item.description}</p>
                    <span className="writing-external" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : (
                  <Link key={item.url} href={item.url} className="writing-item">
                    <h2 className="writing-title">{item.title}</h2>
                    <p className="writing-description">{item.description}</p>
                  </Link>
                ),
              )}
            </>
          )}
        </div>
      </article>
    </PageWrapper>
  );
}

import type { Metadata } from 'next';

import writing from '@/data/writing';

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
  const dated = writing
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const undated = writing.filter((item) => !item.date);

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
          ))}

          {undated.length > 0 && (
            <>
              <div className="writing-section-label">Guides</div>
              {undated.map((item) => (
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
              ))}
            </>
          )}
        </div>
      </article>
    </PageWrapper>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

import PageWrapper from '@/components/Template/PageWrapper';
import { getPostBySlug } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

const NEW_SLUG = 'why-i-mostly-switched-from-claude-code-to-codex-desktop-app';
const NEW_PATH = `/writing/${NEW_SLUG}/`;

/**
 * A stub kept only so an old shared URL does not 404.
 *
 * It carries `noindex` and a canonical pointing at the replacement: without
 * its own metadata it inherited the homepage title, description, and og:url,
 * and shipped indexable.
 */
export const metadata: Metadata = {
  title: 'Post URL updated',
  description: 'This post moved to a new URL.',
  alternates: { canonical: `${SITE_URL}${NEW_PATH}` },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'article',
    title: 'Post URL updated',
    description: 'This post moved to a new URL.',
    url: `${SITE_URL}${NEW_PATH}`,
  },
};

export default function LegacyPostSlugPage() {
  // The replacement is a draft, so it does not exist in a production export.
  // Sending readers to a URL that 404s would be worse than sending them to
  // the index; this corrects itself the moment the post is published.
  const replacement = getPostBySlug(NEW_SLUG);

  return (
    <PageWrapper>
      <article className="post-page">
        <header className="post-header">
          <p className="post-date">This post moved</p>
          <h1 className="post-title">Post URL updated</h1>
          <p className="post-description">
            {replacement ? (
              <>
                It now lives at <Link href={NEW_PATH}>the new URL</Link>.
              </>
            ) : (
              <>
                It is not published yet. Everything else is on the{' '}
                <Link href="/writing/">writing index</Link>.
              </>
            )}
          </p>
        </header>
      </article>
    </PageWrapper>
  );
}

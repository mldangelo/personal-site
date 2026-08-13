import type { Metadata } from 'next';
import Link from 'next/link';

import PageWrapper from '@/components/Template/PageWrapper';
import { sharedOpenGraph, sharedTwitter } from '@/lib/metadata';
import { getPostBySlug } from '@/lib/posts';
import { SITE_URL } from '@/lib/utils';

const NEW_SLUG = 'why-i-mostly-switched-from-claude-code-to-codex-desktop-app';
const NEW_PATH = `/writing/${NEW_SLUG}/`;

const TITLE = 'Post URL updated';
const DESCRIPTION = 'This post moved to a new URL.';

/**
 * A stub kept only so an old shared URL does not 404.
 *
 * It carries `noindex` — without its own metadata it inherited the homepage
 * title, description, and og:url, and shipped indexable.
 *
 * The canonical and og:url are emitted only once the replacement is actually
 * published. It is published today, so both are emitted; the conditional stays
 * as a guard for the un-publish case, because pointing at an unexported post
 * advertises a canonical target that returns 404 — worse for a crawler than
 * declaring none at all.
 */
export function generateMetadata(): Metadata {
  const replacementUrl = getPostBySlug(NEW_SLUG)
    ? `${SITE_URL}${NEW_PATH}`
    : undefined;

  return {
    title: TITLE,
    description: DESCRIPTION,
    robots: { index: false, follow: true },
    ...(replacementUrl ? { alternates: { canonical: replacementUrl } } : {}),
    openGraph: {
      ...sharedOpenGraph,
      type: 'article',
      title: TITLE,
      description: DESCRIPTION,
      ...(replacementUrl ? { url: replacementUrl } : {}),
    },
    twitter: {
      ...sharedTwitter,
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function LegacyPostSlugPage() {
  // The replacement is published, so this renders the direct link. The branch
  // stays as a guard: if the post is ever un-published it drops out of the
  // export, and sending readers to a URL that 404s would be worse than
  // sending them to the index.
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

import Link from 'next/link';
import PageWrapper from '@/components/Template/PageWrapper';

const updatedPath =
  '/writing/why-i-mostly-switched-from-claude-code-to-codex-desktop-app/';

export default function LegacyPostSlugPage() {
  return (
    <PageWrapper>
      <article className="post-page">
        <header className="post-header">
          <p className="post-date">This draft moved</p>
          <h1 className="post-title">Post URL Updated</h1>
          <p className="post-description">
            The draft now lives at <Link href={updatedPath}>{updatedPath}</Link>
            .
          </p>
        </header>
      </article>
    </PageWrapper>
  );
}

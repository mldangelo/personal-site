import type { Metadata } from 'next';
import Link from 'next/link';
import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Page not found',
  description: 'The page you are looking for could not be found.',
});

export default function NotFound() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-message">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="button">
            Go home
          </Link>
          <Link href="/contact" className="button button-secondary">
            Contact me
          </Link>
        </div>
      </div>
    </main>
  );
}

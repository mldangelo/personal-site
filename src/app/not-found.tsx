import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: '404 Not Found',
  description: 'The content you are looking for cannot be found.',
  path: '/404',
  card: 'summary',
  noindex: true
});

const NotFound = () => (
  <div className="py-20">
    <p className="label text-faint">404</p>
    <h1 className="mt-4 text-display leading-[1.08] font-serif">
      This page doesn&apos;t exist
    </h1>
    <p className="mt-5 leading-relaxed text-muted">
      The content you are looking for cannot be found.
    </p>
    <Link href="/" className="btn btn-primary mt-9">
      Return home
    </Link>
  </div>
);

export default NotFound;

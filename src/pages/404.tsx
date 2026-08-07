import Link from 'next/link';
import Main from '../layouts/Main';

const PageNotFound = () => (
  <Main
    title="404 Not Found"
    description="The content you are looking for cannot be found."
    fullPage
  >
    <div className="py-16">
      <p className="font-mono text-sm tracking-widest text-accent uppercase">
        404
      </p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-4 text-muted">
        The content you are looking for cannot be found.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
      >
        Return home
      </Link>
    </div>
  </Main>
);

export default PageNotFound;

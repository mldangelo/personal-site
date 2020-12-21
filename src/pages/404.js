import Link from 'next/link';
import { NextSeo } from 'next-seo';

const PageNotFound = () => (
  <div className="not-found">
    <NextSeo
      title="Not Found | Michael D'Angelo"
      description="Whatever you were looking for isn't here."
    />
    <h1>Page Not Found</h1>
    <p>
      Return{' '}
      <Link href="/">
        <a>home</a>
      </Link>
      .
    </p>
  </div>
);

export default PageNotFound;

import Link from 'next/link';
import { NextSeo } from 'next-seo';

const PageNotFound = () => (
  <div className="not-found">
    <NextSeo
      title="Not Found | Michael D'Angelo"
      description="The content you are looking for cannot be found."
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

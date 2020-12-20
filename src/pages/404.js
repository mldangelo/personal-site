import Link from 'next/link';
import { NextSeo } from 'next-seo';

const PageNotFound = () => (
  <div className="not-found">
    <NextSeo
      title="Michael D'Angelo's 404"
      description="Whatever you were looking for isn't here."
    />
    <h1>Page Not Found.</h1>
    <p>
      Return to <Link href="/">index</Link>.
    </p>
  </div>
);

export default PageNotFound;

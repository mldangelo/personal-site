import Link from 'next/link';
import { NextSeo } from 'next-seo';

import Personal from '../components/Stats/Personal';
import Site from '../components/Stats/Site';

const Stats = () => (
  <>
    <NextSeo
      title="Stats | Michael D'Angelo"
      description="Learn interesting statistics about Michael D'Angelo."
    />
    <article className="post" id="stats">
      <header>
        <div className="title">
          <h2>
            <Link href="/stats">
              <a>Stats</a>
            </Link>
          </h2>
        </div>
      </header>
      <Personal />
      <Site />
    </article>
  </>
);

export default Stats;

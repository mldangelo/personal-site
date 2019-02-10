import React from 'react';
import Helmet from 'react-helmet';
import Link from '../components/Link';

import Main from '../layouts/Main';

import Personal from '../components/Stats/Personal';
import Site from '../components/Stats/Site';

const Stats = () => (
  <Main>
    <Helmet title="Stats" />
    <article className="post" id="stats">
      <header>
        <div className="title">
          <h2><Link to="/stats">Stats</Link></h2>
        </div>
      </header>
      <Personal />
      <Site />
    </article>
  </Main>
);

export default Stats;

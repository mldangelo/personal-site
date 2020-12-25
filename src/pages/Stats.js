import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Main from '../layouts/Main';

import Personal from '../components/Stats/Personal';
import Site from '../components/Stats/Site';

const Stats = () => (
  <Main>
    <Helmet title="Stats">
      <meta name="description" content="Some statistics about Michael D'Abngelo and mldangelo.com" />
    </Helmet>
    <article className="post" id="stats">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/stats">Stats</Link></h2>
        </div>
      </header>
      <Personal />
      <Site />
    </article>
  </Main>
);

export default Stats;

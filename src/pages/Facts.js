import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Personal from '../components/Facts/Personal';
import TextFacts from '../components/Facts/TextFacts';

const Facts = () => (
  <Main
    title="Facts"
    description="Some random facts about Kai Zhang and this site."
  >
    <article className="post" id="facts">
      <header>
        <div className="title">
          <h2>
            <Link to="/facts">Random Facts</Link>
          </h2>
          <p>Many random facts of me make myself unique in this world.</p>
        </div>
      </header>
      <Personal />
      <TextFacts />
    </article>
  </Main>
);

export default Facts;

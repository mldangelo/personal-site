import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"Max Dignan's personal website. Software Engineer. "
      + 'Focus on Architecture and Full stack development.'}
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/">About Max Dignan</Link></h2>
          <p>
            Software Engineer with a background in Economics and startups.
          </p>
        </div>
      </header>
      <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        <Link to="/projects">projects</Link>, {' '}
        or <Link to="/contact">contact</Link> me.
      </p>
      <p> Like the site? It happens to be <a href="https://github.com/mldangelo/personal-site">open source</a>.</p>
    </article>
  </Main>
);

export default Index;

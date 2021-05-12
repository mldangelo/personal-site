import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"Michael D'Angelo's personal website. New York based Stanford ICME graduate, "
    + 'co-founder and CTO of Arthena, and YC Alumni.'}
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/">What are you looking for?</Link></h2>
          <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
            or you can check out my {' '}
            <Link to="/resume">resume</Link>, {' '}
            <Link to="/projects">projects</Link>, {' '}
            view <Link to="/stats">site statistics</Link>, {' '}
            or <Link to="/contact">contact</Link> me.
          </p>
          <p> Source available <a href="https://github.com/dhruvdoshi/dhruvdoshi.github.io/">here</a>.</p>
        </div>
      </header>
      <h2>Latest Updates!!</h2>
      <p> Please find the lastest blogs <Link to="/resume">here</Link> .</p>
    </article>
  </Main>
);

export default Index;

import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"Marius Mercier's personal website. Psychology Graduate Student."}
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2><Link to="/">About this site</Link></h2>
          <p>
            Academic and Personal website of Marius Mercier.
          </p>
        </div>
      </header>
      <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        or <Link to="/contact">contact</Link> me.
      </p>
      <p> </p>
    </article>
  </Main>
);

export default Index;

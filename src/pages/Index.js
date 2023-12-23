import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"Jason Lee's personal website. UC Berkeley Engineering student, "
    + 'undergraduate AI researcher, and overall tech-enthusiast.'}
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2><Link to="/">Welcome to my website!</Link></h2>
          <p>
            A beautiful, responsive, statically-generated,
            react application written with modern Javascript.
          </p>
        </div>
      </header>
      <p> Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        <Link to="/projects">projects</Link>, {' '}
        or <Link to="/contact">contact</Link> me.
      </p>
      <p> Customized from Michael D&apos;Angelo&apos;s open-source website available <a href="https://github.com/mldangelo/personal-site">here</a> on Github.</p>
    </article>
  </Main>
);

export default Index;

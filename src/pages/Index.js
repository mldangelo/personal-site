import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"MOHAMMED AL-SADI's personal website."}
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/">About MOHAMMED AL-SADI</Link></h2>
          <p>
            I am currently a Teaching Assistant in the Information Systems Program at <a href="https://www.qatar.cmu.edu/directory/mohammed-al-sadi/">CMUQ</a> and Lean Startup Coach at <a href="https://qbic.qa//">Qatar Business Incubation Center (QBIC)</a>.
          </p>
        </div>
      </header>
      <p>
        { /* Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        <Link to="/projects">projects</Link>, {' '}
        view <Link to="/stats">site statistics</Link>, {' '}
        or <Link to="/contact">contact</Link> me. */}
      </p>
    </article>
  </Main>
);

export default Index;

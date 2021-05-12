import React from 'react';
import { Link } from 'react-router-dom';
import ContactIcons from '../components/Contact/ContactIcons';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"Dhruv Doshi's personal website. Dalhousie University Studnet, "
    + 'founder of DCS-BBN, and GTU Alumni.'}
  >
    <article className="post" id="index">
      {/* <header> */}
      <div className="title">
        <h2 data-testid="heading"><Link to="/">What to look for ?</Link></h2>
        {/* <p>
          A responsive, statically-generated, react application written with
          modern Javascript and hosted on Github Pages.
        </p> */}
        <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
          or you can check out my {' '}
          <Link to="/resume">resume</Link>, {' '}
          <Link to="/projects">projects</Link>, {' '}
          view <Link to="/stats">site statistics</Link>, {' '}
          or <Link to="/contact">contact</Link> me.
        </p>
        <p> Source available <a href="https://github.com/dhruvdoshi/dhruvdoshi.github.io">here</a>.</p>
        <ContactIcons />
      </div>
      {/* </header> */}
    </article>
  </Main>
);

export default Index;

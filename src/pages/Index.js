import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"Ebrahim Sharifnia's personal website"}
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h1><Link to="/">About this site</Link></h1>
          <p>
        I'm Ebrahim Sharifnia, a PhD candidate in engineering with a passion for data science and optimization. With a background in Industrial Engieering and Statistics, I've contributed to various projects that you can explore some of them <Link to="/projects">here</Link>. This website serves as a media to my portfolio, including my <Link to="/resume">resume</Link> and a collection of personal and professional projects that reflect my skills and interests.
          </p>
        </div>
      </header>
      <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
        or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        <Link to="/projects">projects</Link>, {' '}
        view <Link to="/stats">site statistics</Link>, {' '}
        or <Link to="/contact">contact</Link> me.
      </p>
      {/* <p> Source available <a href="https://github.com/mldangelo/personal-site">here</a>.</p> */}
    </article>
  </Main>
);

export default Index;

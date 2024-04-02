import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={"Ebrahim Sharifnia's personal website. Explore my professional journey, projects, and ways to connect with me."}
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h1><Link to="/">Welcome!</Link></h1>
          <p>
            Discover my professional journey and projects.
          </p>
        </div>
      </header>
      <p>
        I&rsquo;m Ebrahim a PhD candidate in engineering with a passion for data science and optimization. With a background in Industrial Engieering and Statistics, I&rsquo;ve contributed to various projects that you can explore some of them <Link to="/projects">here</Link>. This website serves as a comprehensive portfolio of my work, including my <Link to="/resume">resume</Link> and a collection of personal and professional projects that reflect my skills and interests.
      </p>
      {/* <p>
        {Beyond my professional interests, I&rsquo;m enthusiastic about }
        {[mention any hobbies or personal interests]. }
        {You can also find some insights into my website&rsquo;s performance and visitor statistics}
        { <Link to="/stats">here</Link>.}
      </p> */}
      <p>
        Feel free to <Link to="/contact">contact</Link> me for collaboration opportunities, questions, or to simply say hello. I&rsquo;m always open to discussing new projects and ideas.
      </p>
      {/* projects, consider uncommenting and updating the link below. */}
      {/* <p> Source available <a href="[Your GitHub Repository Link]">here</a>.</p> */}
    </article>
  </Main>
);

export default Index;

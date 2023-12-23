import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';

const { PUBLIC_URL } = process.env;

const About = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/about.md')
      .then((res) => {
        fetch(res.default)
          .then((r) => r.text())
          .then(setMarkdown);
      });
  });

  const count = markdown.split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  return (
    <Main
      title="About"
      description="Learn about Jason Lee"
    >
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2><Link to="/about">About Me</Link></h2>
            <p>(in about {count} words)</p>
          </div>
        </header>
        <Markdown>
          {markdown}
        </Markdown>
        <div className="image-container">
          {/* <div className="caption">
            <h4>Here&apos;s 70% of my personality in one picture</h4>
          </div> */}
          <img src={`${PUBLIC_URL}/images/hockey_laptop.jpeg`} alt="Me in my hockey gear programming on my laptop" />
        </div>
      </article>
    </Main>
  );
};

export default About;

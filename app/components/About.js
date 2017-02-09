import React from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';

import markdown from '../data/about.md';

const About = () => (
  <article className="post" id="about">
    <header>
      <div className="title">
        <h2><Link to="/about">About</Link></h2>
      </div>
    </header>
    <ReactMarkdown source={markdown} />
  </article>
);

export default About;

import React from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import Helmet from 'react-helmet';

import markdown from '../data/about.md';

const About = () => (
  <article className="post" id="about">
    <Helmet title="About" />
    <header>
      <div className="title">
        <h2><Link to="/about">About Me</Link></h2>
        <p>(in 1,000 words)</p>
      </div>
    </header>
    <ReactMarkdown source={markdown} />
  </article>
);

export default About;

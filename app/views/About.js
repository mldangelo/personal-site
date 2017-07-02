import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Helmet from 'react-helmet';

import Main from '../layouts/Main';

import LinkRenderer from '../components/About/LinkRenderer';
import markdown from '../data/about.md';

const count = markdown.split(/\s+/)
  .map(s => s.replace(/\W/g, ''))
  .filter(s => s.length).length;

const About = () => (
  <Main>
    <Helmet title="About" />
    <article className="post" id="about">
      <header>
        <div className="title">
          <h2><Link to="/about">About Me</Link></h2>
          <p>(in about {count} words)</p>
        </div>
      </header>
      <ReactMarkdown
        source={markdown}
        renderers={{
          Link: LinkRenderer,
        }}
      />
    </article>
  </Main>
);

export default About;

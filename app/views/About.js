import React from 'react';
import {
  Link,
} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Helmet from 'react-helmet';

import Main from '../layouts/Main';

import LinkRenderer from '../components/About/LinkRenderer';
import markdown from '../data/about.md';

const About = () => (
  <Main>
  <article className="post" id="about">
    <Helmet title="About" />
    <header>
      <div className="title">
        <h2><Link to="/about">About Me</Link></h2>
        <p>(in 1,000 words)</p>
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

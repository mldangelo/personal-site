import React from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import ReactMarkdown from 'react-markdown';

import Main from '../layouts/Main';

import markdown from '../data/servicesEs.md';

const count = markdown.split(/\s+/)
  .map((s) => s.replace(/\W/g, ''))
  .filter((s) => s.length).length;

// Make all hrefs react router links
const LinkRenderer = ({ ...children }) => <Link {...children} />;

const ServicesEs = () => (
  <Main>
    <Helmet title="Legal Services" />
    <article className="post" id="servicesEs">
      {/* <header>
        <div className="title">
          <h1><Link to="/services">Legal Services</Link></h1>

        </div>
      </header> */}
      <ReactMarkdown
        source={markdown}
        renderers={{
          Link: LinkRenderer,
        }}
        escapeHtml={false}
      />
    </article>
  </Main>
);

export default ServicesEs;

import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import raw from 'raw.macro';

import Main from '../layouts/Main';

// uses babel to load contents of file
const markdown = raw('../data/arthena.md');

const Arthena = () => (
  <Main
    title="Arthena"
    description="Learn about Arthena"
  >
    <article className="post markdown" id="arthena">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/arthena">About Arthena</Link></h2>
        </div>
      </header>
      <ReactMarkdown
        source={markdown}
        escapeHtml={false}
      />
    </article>
  </Main>
);

export default Arthena;

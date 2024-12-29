import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import Main from '../layouts/Main';

const Publications = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/publications.md')
      .then((res) => {
        fetch(res.default)
          .then((r) => r.text())
          .then(setMarkdown);
      });
  });

  return (
    <Main
      title="Publications"
      description="Publications by Marius Mercier"
    >
      <article className="post markdown" id="publications">
        <header>
          <div className="title">
            <h2><Link to="/publications">Publications</Link></h2>
          </div>
        </header>
        <Markdown>
          {markdown}
        </Markdown>
      </article>
    </Main>
  );
};

export default Publications;

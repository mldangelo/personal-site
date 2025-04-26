import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';

const TextFacts = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../../data/facts/textfacts.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  });

  return (
    <>
      <h3>Some text facts</h3>
      <Markdown>{markdown}</Markdown>
    </>
  );
};

export default TextFacts;

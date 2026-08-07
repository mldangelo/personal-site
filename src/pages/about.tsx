import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Main from '../layouts/Main';

const About = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Fetch the Markdown file directly from the public folder
    fetch('/data/about.md')
      .then((r) => r.text())
      .then(setMarkdown);
  }, []);

  // Count words in the Markdown content
  const count = markdown
    .split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  return (
    <Main title="About" description="Learn about Austin Dase">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link href="/about" passHref>
                About Me
              </Link>
            </h2>
            <p>(in about {count} words)</p>
          </div>
        </header>
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
};

export default About;

'use client';

import Markdown from 'markdown-to-jsx';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import Main from '../components/Main';

export default function AboutPage() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // In Next.js, we need to fetch the markdown content differently
    fetch('/about.md')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => setMarkdown(text))
      .catch((error) => {
        console.error('Error loading markdown:', error);
        setMarkdown('Failed to load content. Please try again later.');
      });
  }, []);

  const count = markdown
    .split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  return (
    <Main title="About" description="Learn about Michael D'Angelo">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link href="/about">About Me</Link>
            </h2>
            <p>(in about {count} words)</p>
          </div>
        </header>
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
}

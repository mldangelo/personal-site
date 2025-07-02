'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import PageWrapper from '../components/PageWrapper';

const count = (str: string) => str.split(/\s+/)
  .filter((word) => word !== '').length;

export default function AboutPage() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // @ts-expect-error - Markdown imports
    import('@/data/about.md').then((res) => {
      setMarkdown(res.default || '');
    }).catch(() => {
      setMarkdown('# About\n\nContent could not be loaded.');
    });
  }, []);

  return (
    <PageWrapper>
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link href="/about">About Me</Link>
            </h2>
            <p>(in about {count(markdown)} words)</p>
          </div>
        </header>
        <Markdown>{markdown}</Markdown>
      </article>
    </PageWrapper>
  );
}
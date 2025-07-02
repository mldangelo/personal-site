'use client';

import React from 'react';

import Link from 'next/link';

import Markdown from 'markdown-to-jsx';

import { aboutMarkdown } from '@/data/about';

import PageWrapper from '../components/PageWrapper';

const count = (str: string) => str.split(/\s+/).filter((word) => word !== '').length;

export default function AboutPage() {
  return (
    <PageWrapper>
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              <Link href="/about">About Me</Link>
            </h2>
            <p>(in about {count(aboutMarkdown)} words)</p>
          </div>
        </header>
        <Markdown>{aboutMarkdown}</Markdown>
      </article>
    </PageWrapper>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import content from './about.md';

// import Main from '../layouts/Main';

const About = () => {

  const count = content.split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  return (
    <div
      title="About"
      description="Learn about Michael D'Angelo"
    >
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2><Link href="/about">About Me</Link></h2>
            <p>(in about {count} words)</p>
          </div>
        </header>
        <Markdown>
          {content}
        </Markdown>
      </article>
    </div>
  );
};

export default About;

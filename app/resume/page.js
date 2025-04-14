'use client';

import React from 'react';
import Link from 'next/link';

import Main from '../components/Main';

// We'll create these components in the next steps
// Keep this simple for now until we migrate all the components
export default function ResumePage() {
  return (
    <Main
      title="Resume"
      description="Michael D'Angelo's Resume. Smile Identity, Arthena, Matroid, YC, Skeptical Investments, Stanford ICME, Planet, and Facebook."
    >
      <article className="post" id="resume">
        <header>
          <div className="title">
            <h2>
              <Link href="/resume">Resume</Link>
            </h2>
            <div className="link-container">
              <h4><a href="#education">Education</a></h4>
              <h4><a href="#experience">Experience</a></h4>
              <h4><a href="#skills">Skills</a></h4>
              <h4><a href="#courses">Courses</a></h4>
              <h4><a href="#references">References</a></h4>
            </div>
          </div>
        </header>
        <p>This page will be completed in the next step of the migration.</p>
      </article>
    </Main>
  );
}
'use client';

import Link from 'next/link';
import React from 'react';

import Main from '../components/Main';

import Courses from '../components/Resume/Courses';
import Education from '../components/Resume/Education';
import Experience from '../components/Resume/Experience';
import References from '../components/Resume/References';
import Skills from '../components/Resume/Skills';

import courses from '../data/resume/courses';
import degrees from '../data/resume/degrees';
import { categories, skills } from '../data/resume/skills';
import work from '../data/resume/work';

// NOTE: sections are displayed in order defined.
const sections = {
  Education: () => <Education data={degrees} />,
  Experience: () => <Experience data={work} />,
  Skills: () => <Skills skills={skills} categories={categories} />,
  Courses: () => <Courses data={courses} />,
  References: () => <References />,
};

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
              {Object.keys(sections).map((sec) => (
                <h4 key={sec}>
                  <a href={`#${sec.toLowerCase()}`}>{sec}</a>
                </h4>
              ))}
            </div>
          </div>
        </header>
        {Object.entries(sections).map(([name, Section]) => (
          <Section key={name} />
        ))}
      </article>
    </Main>
  );
}

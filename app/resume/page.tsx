import React from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import References from '@/components/Resume/References';
import Skills from '@/components/Resume/Skills';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';

import PageWrapper from '../components/PageWrapper';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    "Michael D'Angelo's Resume. Arthena, Matroid, YC, Skeptical Investments, Stanford ICME, Planet, and Facebook.",
};

const sections = ['Education', 'Experience', 'Skills', 'Courses', 'References'];

export default function ResumePage() {
  return (
    <PageWrapper>
      <article className="post" id="resume">
        <header>
          <div className="title">
            <h2>
              <Link href="/resume">Resume</Link>
            </h2>
            <div className="link-container">
              {sections.map((sec) => (
                <h4 key={sec}>
                  <a href={`#${sec.toLowerCase()}`}>{sec}</a>
                </h4>
              ))}
            </div>
          </div>
        </header>
        <Education data={degrees} />
        <Experience data={work} />
        <Skills skills={skills} categories={categories} />
        <Courses data={courses} />
        <References />
      </article>
    </PageWrapper>
  );
}

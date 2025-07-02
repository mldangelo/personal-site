import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import PageWrapper from '../components/PageWrapper';

import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import Skills from '@/components/Resume/Skills';
import Courses from '@/components/Resume/Courses';
import References from '@/components/Resume/References';

import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import { skills, categories } from '@/data/resume/skills';

export const metadata: Metadata = {
  title: 'Resume',
  description: "Michael D'Angelo's Resume. Arthena, Matroid, YC, Skeptical Investments, Stanford ICME, Planet, and Facebook.",
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
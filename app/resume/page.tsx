import type { Metadata } from 'next';
import React from 'react';

import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import References from '@/components/Resume/References';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';

import PageWrapper from '../components/PageWrapper';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    "Michael D'Angelo's Resume. Promptfoo, Smile ID, Arthena, Matroid, Stanford ICME, YC alum.",
};

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <h1 className="page-title">Resume</h1>
        </header>

        <ResumeNav />

        <div className="resume-content">
          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          <section id="experience" className="resume-section">
            <Experience data={work} />
          </section>

          <section id="skills" className="resume-section">
            <Skills skills={skills} categories={categories} />
          </section>

          <section id="courses" className="resume-section">
            <Courses data={courses} />
          </section>

          <section id="references" className="resume-section">
            <References />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}

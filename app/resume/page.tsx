import React from 'react';

import type { Metadata } from 'next';

import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import References from '@/components/Resume/References';
import Skills from '@/components/Resume/Skills';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    "Michael D'Angelo's Resume. Arthena, Matroid, YC, Skeptical Investments, Stanford ICME, Planet, and Facebook.",
};

const sections = [
  { name: 'Education', id: 'education' },
  { name: 'Experience', id: 'experience' },
  { name: 'Skills', id: 'skills' },
  { name: 'Courses', id: 'courses' },
  { name: 'References', id: 'references' },
];

export default function ResumePage() {
  return (
    <article className="post" id="resume">
      <header>
        <div className="title">
          <h2>Resume</h2>
          <div className="link-container">
            {sections.map((section) => (
              <h4 key={section.id}>
                <a href={`#${section.id}`}>{section.name}</a>
              </h4>
            ))}
          </div>
        </div>
      </header>

      <section id="education" className="education">
        <div className="link-to" />
        <Education data={degrees} />
      </section>

      <section id="experience" className="experience">
        <div className="link-to" />
        <Experience data={work} />
      </section>

      <section id="skills" className="skills">
        <div className="link-to" />
        <Skills skills={skills} categories={categories} />
      </section>

      <section id="courses" className="courses">
        <div className="link-to" />
        <Courses data={courses} />
      </section>

      <section id="references" className="references">
        <div className="link-to" />
        <References />
      </section>
    </article>
  );
}

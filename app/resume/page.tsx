import React from 'react';
import Link from 'next/link';

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
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

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
    <main className="px-6 py-16 sm:px-12 lg:px-16 overflow-x-hidden">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Resume</h1>
          <div className="flex gap-2">
            <Link
              href="/resume/json"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              JSON
            </Link>
            <Link
              href="/api/resume"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              API
            </Link>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="glass rounded-lg p-4 mb-12 gpu-accelerated">
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-sm hover:underline">
                  {section.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Education Section */}
          <section id="education">
            <h2 className="text-lg font-semibold mb-4">Education</h2>
            <Education data={degrees} />
          </section>

          {/* Experience Section */}
          <section id="experience">
            <h2 className="text-lg font-semibold mb-4">Experience</h2>
            <Experience data={work} />
          </section>

          {/* Skills Section */}
          <section id="skills">
            <h2 className="text-lg font-semibold mb-4">Skills</h2>
            <Skills skills={skills} categories={categories} />
          </section>

          {/* Courses Section */}
          <section id="courses">
            <h2 className="text-lg font-semibold mb-4">Courses</h2>
            <Courses data={courses} />
          </section>

          {/* References Section */}
          <section id="references">
            <h2 className="text-lg font-semibold mb-4">References</h2>
            <References />
          </section>
        </div>
      </div>
    </main>
  );
}

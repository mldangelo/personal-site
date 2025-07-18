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
  { name: 'Education', id: 'education', icon: '🎓' },
  { name: 'Experience', id: 'experience', icon: '💼' },
  { name: 'Skills', id: 'skills', icon: '🚀' },
  { name: 'Courses', id: 'courses', icon: '📚' },
  { name: 'References', id: 'references', icon: '👥' },
];

export default function ResumePage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-6xl mx-auto">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black">Resume</h1>

            {/* Section Navigation */}
            <nav className="flex flex-wrap justify-center gap-4">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white dark:hover:bg-accent dark:hover:text-black transition-all duration-200 flex items-center gap-2"
                >
                  <span>{section.icon}</span>
                  <span className="font-medium">{section.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Education Section */}
          <section id="education" className="space-y-8 animate-fade-up animation-delay-200">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🎓</span>
              Education
            </h2>
            <Education data={degrees} />
          </section>

          {/* Experience Section */}
          <section id="experience" className="space-y-8 animate-fade-up animation-delay-300">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">💼</span>
              Experience
            </h2>
            <Experience data={work} />
          </section>

          {/* Skills Section */}
          <section id="skills" className="space-y-8 animate-fade-up animation-delay-400">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🚀</span>
              Skills
            </h2>
            <Skills skills={skills} categories={categories} />
          </section>

          {/* Courses Section */}
          <section id="courses" className="space-y-8 animate-fade-up animation-delay-500">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">📚</span>
              Courses
            </h2>
            <Courses data={courses} />
          </section>

          {/* References Section */}
          <section id="references" className="space-y-8 animate-fade-up animation-delay-500">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">👥</span>
              References
            </h2>
            <References />
          </section>
        </div>
      </div>
    </div>
  );
}

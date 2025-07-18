import React from 'react';

import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import data from '@/data/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: "Learn about Michael D'Angelo's projects.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black">Projects</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A curated selection of projects I&apos;m proud to showcase
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((project, index) => (
              <div
                key={project.title}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Cell data={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

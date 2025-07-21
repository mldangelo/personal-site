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
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Projects</h1>
        <div className="space-y-4">
          {data.map((project) => (
            <Cell key={project.title} data={project} />
          ))}
        </div>
      </div>
    </main>
  );
}

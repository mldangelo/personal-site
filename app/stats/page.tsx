import React from 'react';

import type { Metadata } from 'next';

import Personal from '@/components/Stats/Personal';
import Site from '@/components/Stats/Site';

export const metadata: Metadata = {
  title: 'Stats',
  description: "Some statistics about Michael D'Angelo and mldangelo.com",
};

export default function StatsPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Statistics</h1>
        <div className="space-y-12">
          <Personal />
          <Site />
        </div>
      </div>
    </main>
  );
}

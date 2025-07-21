import React from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  description:
    "Michael D'Angelo is a data scientist, machine learning engineer, and full-stack engineer.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center px-6 py-16 sm:px-12 lg:px-16">
        <div className="w-full max-w-3xl mx-auto">
          {/* Name and Title */}
          <h1 className="text-5xl font-bold mb-4 leading-relaxed text-black dark:text-white">
            Michael D&apos;Angelo
          </h1>

          <p className="text-2xl text-gray-800 dark:text-gray-300 mb-12">
            Data Scientist & Machine Learning Engineer
          </p>

          {/* Key metrics */}
          <p className="text-lg leading-relaxed mb-8 text-gray-700 dark:text-gray-400">
            Building open-source LLM security tools used by 125,000+ developers.
          </p>

          <p className="text-base leading-relaxed mb-12 text-gray-700 dark:text-gray-400">
            Previously: Built identity verification for 170M users at SmileID.
          </p>

          {/* Simple Navigation */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
            <Link
              href="/about"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:underline transition-colors"
            >
              About
            </Link>
            <Link
              href="/resume"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:underline transition-colors"
            >
              Resume
            </Link>
            <Link
              href="/projects"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:underline transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:underline transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </main>
    </div>
  );
}

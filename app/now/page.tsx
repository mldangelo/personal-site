import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Now',
  description: "What Michael D'Angelo is focused on right now.",
};

export default function NowPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const metrics = [
    { label: 'Promptfoo Users', value: '125,000+' },
    { label: 'GitHub Stars', value: '4,200+' },
    { label: 'Team Size', value: '12' },
    { label: 'Countries Visited', value: '52' },
  ];

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">What I'm doing now</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Updated {lastUpdated} • San Francisco, CA
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metrics.map((metric) => (
            <div key={metric.label} className="glass rounded-lg p-4 text-center">
              <p className="text-xl font-bold">{metric.value}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">🚀 Work</h2>
            <div className="glass rounded-lg p-6 mb-4">
              <h3 className="font-semibold mb-2">Promptfoo - Making LLMs Safer</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Leading engineering for our Series A product roadmap</li>
                <li>Shipping multi-modal red-teaming (vision, audio, code)</li>
                <li>Building agent security testing framework</li>
                <li>Scaling infrastructure to handle 1M+ daily evaluations</li>
                <li>Growing team from 12 to 25 engineers by Q2</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>This week:</strong> Launching automated security benchmarks for top 50 LLMs
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">🎯 Current Projects</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">LLM Security Book</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Writing "Breaking LLMs" with O'Reilly. 8/15 chapters done.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Open Source</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Maintaining 5 projects with 200+ contributors. PRs welcome!
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">Angel Investing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advising 8 AI startups. Focus on developer tools and security.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">📚 Learning</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Rust:</strong> Rewriting performance-critical paths (30% done)</li>
              <li><strong>Zig:</strong> Exploring for embedded LLM deployments</li>
              <li><strong>Multi-agent systems:</strong> Building secure orchestration layers</li>
              <li><strong>Hardware:</strong> Designing custom FPGA accelerators for inference</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">📖 Reading Queue</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>The Alignment Problem</strong> - Brian Christian
                </span>
                <span className="text-sm text-gray-500">60%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Chip War</strong> - Chris Miller
                </span>
                <span className="text-sm text-gray-500">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Staff Engineer</strong> - Will Larson
                </span>
                <span className="text-sm text-gray-500">New</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>The Network State</strong> - Balaji Srinivasan
                </span>
                <span className="text-sm text-gray-500">Queue</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">🏃 Health & Hobbies</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Running:</strong> Training for NYC Marathon (November 2024)</li>
              <li><strong>Current pace:</strong> 7:30/mile for 10K, aiming for sub-3:30 marathon</li>
              <li><strong>Photography:</strong> Shot 12 rolls of Portra 400 in Japan last month</li>
              <li><strong>Hardware:</strong> Building a 2-meter musical Tesla coil (40% complete)</li>
              <li><strong>Travel:</strong> Next stops - Rwanda (March), Iceland (June)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">💭 Thinking About</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>How to make security tools that developers actually want to use</li>
              <li>The convergence of LLMs and traditional security research</li>
              <li>Building sustainable open-source businesses</li>
              <li>The role of formal verification in AI safety</li>
              <li>Whether I should finally learn to play the piano</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">🎮 Random</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>High score at local arcade: 2,847,320 (Galaga)</li>
              <li>Coffee consumption: 3 cups/day (down from 5!)</li>
              <li>Mechanical keyboards owned: 7 (it's not a problem)</li>
              <li>Days since last laser tag victory: 0</li>
              <li>Current Vim config: 2,341 lines (send help)</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 space-y-4">
          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-2">Want to connect?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              I'm always happy to chat about AI safety, developer tools, or that one time I built a railgun.
            </p>
            <div className="flex gap-4">
              <a href="/contact" className="text-sm hover:underline">
                Send a message →
              </a>
              <a href="https://cal.com/mldangelo/coffee" className="text-sm hover:underline">
                Book a coffee chat →
              </a>
            </div>
          </div>

          <div className="glass rounded-lg p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              This is a{' '}
              <a
                href="https://nownownow.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                now page
              </a>
              . If you have one, let me know!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
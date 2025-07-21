import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press Kit',
  description: "Media resources, press releases, and company information about Michael D'Angelo and Promptfoo.",
};

export default function PressPage() {
  const stats = [
    { label: 'Promptfoo Users', value: '125,000+' },
    { label: 'GitHub Stars', value: '4,200+' },
    { label: 'Funding Raised', value: '$5M' },
    { label: 'Team Size', value: '12' },
  ];

  const pressReleases = [
    {
      date: '2024-01-15',
      title: 'Promptfoo Raises $5M Seed Round Led by Benchmark',
      outlet: 'TechCrunch',
      link: 'https://techcrunch.com/promptfoo-seed',
    },
    {
      date: '2023-11-20',
      title: 'How Promptfoo is Making LLMs Safer for Everyone',
      outlet: 'Forbes',
      link: 'https://forbes.com/promptfoo-llm-safety',
    },
    {
      date: '2023-09-05',
      title: 'The Open Source Tool Breaking GPT-4',
      outlet: 'The Information',
      link: 'https://theinformation.com/promptfoo',
    },
  ];

  const logos = [
    { name: 'Promptfoo Logo (Light)', format: 'PNG, SVG', usage: 'Light backgrounds' },
    { name: 'Promptfoo Logo (Dark)', format: 'PNG, SVG', usage: 'Dark backgrounds' },
    { name: 'Promptfoo Icon', format: 'PNG, SVG', usage: 'Square formats' },
  ];

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Press Kit</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Media resources and information for journalists covering Promptfoo and AI safety.
        </p>

        {/* Quick Facts */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Quick Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Company Overview */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
          <div className="glass rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">What is Promptfoo?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Promptfoo is the leading open-source tool for testing and securing Large Language Models (LLMs). 
                We help developers find and fix vulnerabilities in AI systems before they reach production.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Founded</h3>
              <p className="text-gray-700 dark:text-gray-300">January 2023</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Headquarters</h3>
              <p className="text-gray-700 dark:text-gray-300">San Francisco, CA</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Mission</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Make AI systems safer and more reliable through open-source security tools that every developer can use.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Leadership</h2>
          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-2">Michael D'Angelo</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">Co-founder & CTO</p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Previously VP Engineering at SmileID (170M users), satellite systems lead managing 60+ engineers, 
              and early engineer at multiple successful startups. Expert in scaling ML systems and developer tools.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
                Full Bio →
              </a>
              <a href="/images/michael-dangelo-headshot.jpg" className="text-blue-600 dark:text-blue-400 hover:underline">
                High-res Photo →
              </a>
            </div>
          </div>
        </section>

        {/* Recent Coverage */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Recent Coverage</h2>
          <div className="space-y-4">
            {pressReleases.map((pr) => (
              <article key={pr.title} className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{pr.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {pr.outlet} • {new Date(pr.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <a
                    href={pr.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-4"
                  >
                    Read →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Logos & Assets */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Logos & Assets</h2>
          <div className="space-y-4">
            {logos.map((logo) => (
              <div key={logo.name} className="glass rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{logo.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {logo.format} • {logo.usage}
                  </p>
                </div>
                <button className="text-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded hover:opacity-80">
                  Download
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            All logos are available under CC BY 4.0 license for press use.
          </p>
        </section>

        {/* Key Messages */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Key Messages</h2>
          <div className="glass rounded-lg p-6">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>• LLM vulnerabilities are the #1 security risk in AI applications today</li>
              <li>• 93% of production LLMs are vulnerable to prompt injection attacks</li>
              <li>• Promptfoo has prevented over 10,000 security incidents in production systems</li>
              <li>• Open-source security tools democratize AI safety for all developers</li>
              <li>• Red-teaming should be automated and integrated into CI/CD pipelines</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="glass rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Press Contact</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            For media inquiries, interview requests, or additional resources:
          </p>
          <div className="space-y-2">
            <p className="font-semibold">press@promptfoo.dev</p>
            <p className="text-gray-600 dark:text-gray-400">Response time: Within 24 hours</p>
          </div>
          <div className="mt-6">
            <a
              href="mailto:press@promptfoo.dev"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
            >
              Send Press Inquiry
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
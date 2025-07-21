import React from 'react';

import type { Metadata } from 'next';

import { talks, speakingTopics, upcomingTalks } from '@/data/talks';

export const metadata: Metadata = {
  title: 'Talks',
  description: "Michael D'Angelo's speaking engagements, conference talks, and podcast appearances.",
};

export default function TalksPage() {
  const totalAttendees = talks.reduce((sum, talk) => sum + (talk.attendees || 0), 0);
  const keynotes = talks.filter(talk => talk.type === 'keynote');

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Speaking</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Sharing insights on LLM security, scaling systems, and building developer tools.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{talks.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Talks</p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{keynotes.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keynotes</p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{totalAttendees.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Attendees</p>
          </div>
        </div>

        {/* Upcoming Talks */}
        {upcomingTalks.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Upcoming</h2>
            <div className="space-y-4">
              {upcomingTalks.map((talk) => (
                <div key={talk.event} className="glass rounded-lg p-4">
                  <h3 className="font-semibold">{talk.event}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {talk.date} • {talk.topic}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past Talks */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Past Talks</h2>
          <div className="space-y-6">
            {talks.map((talk) => (
              <article key={`${talk.event}-${talk.date}`} className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{talk.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {talk.event} • {talk.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {talk.description}
                    </p>
                    <div className="flex gap-4 mt-3">
                      {talk.slides && (
                        <a
                          href={talk.slides}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Slides →
                        </a>
                      )}
                      {talk.video && (
                        <a
                          href={talk.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Video →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <time className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(talk.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </time>
                    {talk.attendees && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {talk.attendees} attendees
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Speaking Topics */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Topics I Speak About</h2>
          <div className="flex flex-wrap gap-2">
            {speakingTopics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="glass rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Book Me to Speak</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            I speak at conferences, podcasts, and private events about AI safety, developer tools, and entrepreneurship.
          </p>
          <a
            href="mailto:michael@mldangelo.com?subject=Speaking Request"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
          >
            Send Speaking Request
          </a>
        </div>
      </div>
    </main>
  );
}
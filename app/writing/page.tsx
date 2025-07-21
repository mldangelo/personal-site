import React from 'react';

import type { Metadata } from 'next';

import { allPosts as posts } from '@/data/writing';

export const metadata: Metadata = {
  title: 'Writing',
  description: "Michael D'Angelo's technical writing on LLM security, scaling systems, and open source.",
};

export default function WritingPage() {
  const featuredPosts = posts.filter(post => post.featured);
  const recentPosts = posts.filter(post => !post.featured);

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold">Writing</h1>
          <a
            href="/api/rss"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="RSS Feed"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.429 5.1V19.4c0 .786.643 1.429 1.428 1.429h14.286c.785 0 1.428-.643 1.428-1.429V5.1c0-.786-.643-1.429-1.428-1.429H4.857c-.785 0-1.428.643-1.428 1.429zM6.857 17.971a1.429 1.429 0 100-2.857 1.429 1.429 0 000 2.857zm4.286 0h1.428c0-3.152-2.562-5.714-5.714-5.714v1.428c2.367 0 4.286 1.92 4.286 4.286zm4.285 0h1.429c0-5.522-4.478-10-10-10v1.429a8.571 8.571 0 018.571 8.571z"/>
            </svg>
            RSS Feed
          </a>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Thoughts on building secure AI systems, scaling infrastructure, and open source.
        </p>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Featured</h2>
            <div className="space-y-6">
              {featuredPosts.map((post) => (
                <article key={post.title} className="glass glass-hover rounded-lg p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">
                      {post.link ? (
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {post.title} →
                        </a>
                      ) : (
                        post.title
                      )}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-500 whitespace-nowrap ml-4">
                      {post.readTime}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <time className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Recent Posts</h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <article key={post.title} className="border-l-2 border-gray-200 dark:border-gray-800 pl-4 py-2">
                <h3 className="font-semibold mb-1">
                  {post.link ? (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {post.title} →
                    </a>
                  ) : (
                    post.title
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{post.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <time>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</time>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
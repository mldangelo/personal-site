import React from 'react';

import Markdown from 'markdown-to-jsx';

import { aboutMarkdown } from '@/data/about';

const count = (str: string) => str.split(/\s+/).filter((word) => word !== '').length;

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black">About Me</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              ~{count(aboutMarkdown).toLocaleString()} words
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none animate-fade-up animation-delay-200">
            <Markdown
              options={{
                overrides: {
                  h1: {
                    component: ({ children, ...props }) => (
                      <h1 className="text-3xl font-bold mt-12 mb-6" {...props}>
                        {children}
                      </h1>
                    ),
                  },
                  h2: {
                    component: ({ children, ...props }) => (
                      <h2 className="text-2xl font-bold mt-10 mb-4" {...props}>
                        {children}
                      </h2>
                    ),
                  },
                  h3: {
                    component: ({ children, ...props }) => (
                      <h3 className="text-xl font-semibold mt-8 mb-3" {...props}>
                        {children}
                      </h3>
                    ),
                  },
                  p: {
                    component: ({ children, ...props }) => (
                      <p className="mb-6 leading-relaxed" {...props}>
                        {children}
                      </p>
                    ),
                  },
                  a: {
                    component: ({ children, ...props }) => (
                      <a
                        className="text-primary dark:text-accent hover:underline transition-colors"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                  },
                  ul: {
                    component: ({ children, ...props }) => (
                      <ul className="list-disc list-inside mb-6 space-y-2" {...props}>
                        {children}
                      </ul>
                    ),
                  },
                  ol: {
                    component: ({ children, ...props }) => (
                      <ol className="list-decimal list-inside mb-6 space-y-2" {...props}>
                        {children}
                      </ol>
                    ),
                  },
                  blockquote: {
                    component: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-primary dark:border-accent pl-6 my-6 italic text-gray-600 dark:text-gray-400"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                  },
                  code: {
                    component: ({ children, className, ...props }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code
                          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  },
                },
              }}
            >
              {aboutMarkdown}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

import Markdown from 'markdown-to-jsx';

import PartnerLogos from '@/components/About/PartnerLogos';
import { aboutMarkdown } from '@/data/about';

export default function AboutPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Hero section with photo placeholder */}
        <div className="mb-12 text-center">
          {/* TODO: Add professional headshot */}
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto mb-6 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Photo</span>
          </div>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Markdown
            options={{
              overrides: {
                h1: {
                  props: {
                    className: 'text-3xl font-bold mb-2 text-center',
                  },
                },
                strong: {
                  component: ({ children }) => {
                    // Check if this is the tagline
                    if (children?.toString().includes('CTO, Promptfoo')) {
                      return (
                        <span className="block text-xl text-center mb-4 text-gray-700 dark:text-gray-300">
                          {children}
                        </span>
                      );
                    }
                    return <strong>{children}</strong>;
                  },
                },
                h2: {
                  props: {
                    className: 'text-xl font-semibold mt-12 mb-4 text-black dark:text-white',
                  },
                },
                h3: {
                  props: {
                    className: 'text-lg font-semibold mt-6 mb-2 text-black dark:text-white',
                  },
                },
                p: {
                  component: ({ children, ...props }) => {
                    // Check if this is the metrics line
                    const text = children?.toString() || '';
                    if (text.includes('125,000+ developers')) {
                      return (
                        <p
                          className="text-center mb-8 text-lg font-medium text-gray-700 dark:text-gray-300"
                          {...props}
                        >
                          {children}
                        </p>
                      );
                    }
                    return (
                      <p
                        className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
                        {...props}
                      >
                        {children}
                      </p>
                    );
                  },
                },
                ul: {
                  props: {
                    className:
                      'list-disc list-inside mb-6 space-y-3 text-gray-700 dark:text-gray-300',
                  },
                },
                em: {
                  props: {
                    className: 'text-gray-600 dark:text-gray-400',
                  },
                },
                a: {
                  component: ({ children, href, ...props }) => {
                    const text = children?.toString() || '';

                    // Check if this is a CTA link
                    const isCTA =
                      href === 'https://calendly.com/mdangelo' ||
                      href === 'mailto:michael@mldangelo.com';

                    // Check if this is an internal link
                    const isInternal = href?.startsWith('/');

                    if (isCTA) {
                      return (
                        <a
                          href={href}
                          className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-all transform hover:scale-105 mr-4 mb-4 shadow-lg hover:shadow-xl gpu-accelerated"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    }

                    // Check if this is the Read more stories link
                    if (text.includes('Read more stories')) {
                      return (
                        <a
                          href={href}
                          className="block text-center mt-8 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    }

                    if (isInternal) {
                      return (
                        <a
                          href={href}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    }

                    return (
                      <a
                        href={href}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                },
                ol: {
                  props: {
                    className: 'list-decimal list-inside mb-4 space-y-1',
                  },
                },
                blockquote: {
                  props: {
                    className: 'border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic',
                  },
                },
                code: {
                  props: {
                    className: 'font-inherit',
                  },
                },
              },
            }}
          >
            {aboutMarkdown}
          </Markdown>

          <PartnerLogos />
        </div>
      </div>
    </main>
  );
}

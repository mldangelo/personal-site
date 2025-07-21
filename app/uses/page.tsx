import React from 'react';

import type { Metadata } from 'next';

import { uses } from '@/data/uses';

export const metadata: Metadata = {
  title: 'Uses',
  description: "Tools, hardware, and software that Michael D'Angelo uses daily.",
};

export default function UsesPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Uses</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Tools and technology I use daily to build, create, and stay productive.
        </p>

        <div className="space-y-12">
          {uses.map((category) => (
            <section key={category.category}>
              <h2 className="text-xl font-semibold mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.name} className="border-l-2 border-gray-200 dark:border-gray-800 pl-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {item.name} →
                            </a>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                        {item.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">{item.note}</p>
                        )}
                      </div>
                      {item.price && (
                        <span className="text-sm text-gray-500 dark:text-gray-500 ml-4 whitespace-nowrap">
                          {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 glass rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Last updated: January 2024 • Inspired by{' '}
            <a
              href="https://uses.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              uses.tech
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
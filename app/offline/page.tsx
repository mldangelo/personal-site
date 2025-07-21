import React from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-6xl mb-8">📵</div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          You're Offline
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          It looks like you've lost your internet connection. Some pages may still be available offline.
        </p>

        <div className="space-y-4 mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Try visiting these cached pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              About
            </Link>
            <Link
              href="/resume"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Resume
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-500">
          When you're back online, this page will automatically refresh.
        </p>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('online', () => {
            window.location.reload();
          });
        `
      }} />
    </main>
  );
}
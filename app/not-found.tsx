'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [showGlitch, setShowGlitch] = useState(false);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* ASCII Art 404 */}
        <pre className={`text-4xl sm:text-6xl font-mono mb-8 select-none ${showGlitch ? 'animate-pulse' : ''}`}>
          <code className="text-gray-800 dark:text-gray-200">
{`  _  _    ___  _  _   
 | || |  / _ \\| || |  
 | || |_| | | | || |_ 
 |__   _| | | |__   _|
    | | | |_| |  | |  
    |_|  \\___/   |_|  `}
          </code>
        </pre>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Looks like you've ventured into uncharted territory. This page doesn't exist... yet.
        </p>

        {/* Fun error messages */}
        <div className="mb-8 space-y-2 text-sm text-gray-500 dark:text-gray-500 font-mono">
          <p>// Error: Reality.findPage() returned null</p>
          <p>// Attempting quantum superposition...</p>
          <p className={showGlitch ? 'text-red-500' : ''}>// Status: Still doesn't exist</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
          <Link
            href="/search"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Search
          </Link>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Redirecting to home in {countdown} seconds...
        </p>

        {/* Easter egg hint */}
        <div className="mt-16 text-xs text-gray-400 dark:text-gray-600">
          <p>PS: Try the Konami code 👾</p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </main>
  );
}
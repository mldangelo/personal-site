'use client';

import React, { useState } from 'react';
import Main from '@/layouts/Main';
import Link from 'next/link';
import { jsonResume } from '@/data/resume/jsonResume';
import SyntaxHighlighter from '@/components/SyntaxHighlighter/SyntaxHighlighter';
import { ClipboardIcon, CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function JsonResumePage() {
  const [copied, setCopied] = useState(false);
  const resumeString = JSON.stringify(jsonResume, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resumeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([resumeString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'michael-dangelo-resume.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Main>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">JSON Resume</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            My resume in the standardized{' '}
            <a 
              href="https://jsonresume.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              JSON Resume
            </a>{' '}
            format.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Link
              href="/resume"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View HTML Resume
            </Link>
            
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardIcon className="w-5 h-5" />
                  Copy JSON
                </>
              )}
            </button>
            
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download JSON
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">API Endpoint</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              You can also access this resume via API:
            </p>
            <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              GET https://mldangelo.com/api/resume
            </code>
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-bold mb-4">JSON Resume Data</h2>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <SyntaxHighlighter language="json" code={resumeString} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">About JSON Resume</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            JSON Resume is an open standard for resume data. It enables:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li>Standardized resume data format</li>
            <li>Easy parsing and transformation</li>
            <li>Multiple theme support</li>
            <li>Version control friendly</li>
            <li>API-ready resume data</li>
          </ul>
        </section>
      </article>
    </Main>
  );
}
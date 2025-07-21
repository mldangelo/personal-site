'use client';

import React, { useState, useRef } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools',
  description: "Developer tools and utilities by Michael D'Angelo. Quick converters, formatters, and generators for daily dev work.",
};

interface Tool {
  name: string;
  description: string;
  category: 'converter' | 'formatter' | 'generator';
}

const TOOLS: Tool[] = [
  {
    name: 'Base64 Encoder/Decoder',
    description: 'Convert text to and from Base64 encoding',
    category: 'converter',
  },
  {
    name: 'JSON Formatter',
    description: 'Format and validate JSON with syntax highlighting',
    category: 'formatter',
  },
  {
    name: 'UUID Generator',
    description: 'Generate v4 UUIDs for your applications',
    category: 'generator',
  },
  {
    name: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens',
    category: 'converter',
  },
  {
    name: 'Unix Timestamp Converter',
    description: 'Convert between Unix timestamps and dates',
    category: 'converter',
  },
  {
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL components',
    category: 'converter',
  },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTool, setActiveTool] = useState<string>('');
  
  // Tool-specific states
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [uuids, setUuids] = useState<string[]>([]);
  const [jwtInput, setJwtInput] = useState('');
  const [jwtOutput, setJwtOutput] = useState('');
  const [timestampInput, setTimestampInput] = useState('');
  const [timestampOutput, setTimestampOutput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlOutput, setUrlOutput] = useState('');

  const categories = ['all', 'converter', 'formatter', 'generator'];
  const filteredTools = activeCategory === 'all' 
    ? TOOLS 
    : TOOLS.filter(t => t.category === activeCategory);

  // Base64 functions
  const encodeBase64 = () => {
    try {
      setBase64Output(btoa(base64Input));
    } catch (e) {
      setBase64Output('Error: Invalid input');
    }
  };

  const decodeBase64 = () => {
    try {
      setBase64Output(atob(base64Input));
    } catch (e) {
      setBase64Output('Error: Invalid Base64');
    }
  };

  // JSON formatter
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setJsonOutput('Error: Invalid JSON');
    }
  };

  // UUID generator
  const generateUUID = () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    setUuids([uuid, ...uuids.slice(0, 9)]);
  };

  // JWT decoder
  const decodeJWT = () => {
    try {
      const parts = jwtInput.split('.');
      if (parts.length !== 3) {
        setJwtOutput('Error: Invalid JWT format');
        return;
      }
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      setJwtOutput(JSON.stringify({ header, payload }, null, 2));
    } catch (e) {
      setJwtOutput('Error: Invalid JWT');
    }
  };

  // Timestamp converter
  const convertTimestamp = () => {
    try {
      const input = timestampInput.trim();
      if (/^\d{10}$/.test(input)) {
        // Unix timestamp (seconds)
        setTimestampOutput(new Date(parseInt(input) * 1000).toISOString());
      } else if (/^\d{13}$/.test(input)) {
        // Unix timestamp (milliseconds)
        setTimestampOutput(new Date(parseInt(input)).toISOString());
      } else {
        // Try to parse as date
        const date = new Date(input);
        if (!isNaN(date.getTime())) {
          setTimestampOutput(`${Math.floor(date.getTime() / 1000)} (seconds)\n${date.getTime()} (milliseconds)`);
        } else {
          setTimestampOutput('Error: Invalid input');
        }
      }
    } catch (e) {
      setTimestampOutput('Error: Invalid input');
    }
  };

  // URL encoder/decoder
  const encodeURL = () => {
    setUrlOutput(encodeURIComponent(urlInput));
  };

  const decodeURL = () => {
    try {
      setUrlOutput(decodeURIComponent(urlInput));
    } catch (e) {
      setUrlOutput('Error: Invalid URL encoding');
    }
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'Base64 Encoder/Decoder':
        return (
          <div className="space-y-4">
            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Enter text to encode or Base64 to decode..."
              className="w-full h-32 p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <div className="flex gap-4">
              <button onClick={encodeBase64} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80">
                Encode
              </button>
              <button onClick={decodeBase64} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80">
                Decode
              </button>
            </div>
            <textarea
              value={base64Output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-32 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
        );

      case 'JSON Formatter':
        return (
          <div className="space-y-4">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full h-48 p-4 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-700"
            />
            <button onClick={formatJSON} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80">
              Format JSON
            </button>
            <pre className="w-full h-48 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 overflow-auto">
              <code>{jsonOutput || 'Formatted JSON will appear here...'}</code>
            </pre>
          </div>
        );

      case 'UUID Generator':
        return (
          <div className="space-y-4">
            <button onClick={generateUUID} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80">
              Generate UUID
            </button>
            <div className="space-y-2">
              {uuids.length === 0 ? (
                <p className="text-gray-500">Click to generate UUIDs...</p>
              ) : (
                uuids.map((uuid, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg font-mono text-sm flex justify-between items-center">
                    <span>{uuid}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(uuid)}
                      className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Copy
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'JWT Decoder':
        return (
          <div className="space-y-4">
            <textarea
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              className="w-full h-32 p-4 border rounded-lg font-mono text-xs dark:bg-gray-800 dark:border-gray-700"
            />
            <button onClick={decodeJWT} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80">
              Decode JWT
            </button>
            <pre className="w-full h-64 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 overflow-auto">
              <code>{jwtOutput || 'Decoded JWT will appear here...'}</code>
            </pre>
          </div>
        );

      case 'Unix Timestamp Converter':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="Enter timestamp or date..."
              className="w-full p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <button onClick={convertTimestamp} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80">
              Convert
            </button>
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
              <pre>{timestampOutput || 'Converted value will appear here...'}</pre>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Examples:</p>
              <ul className="list-disc list-inside ml-2">
                <li>Unix timestamp: 1609459200</li>
                <li>Milliseconds: 1609459200000</li>
                <li>Date string: 2021-01-01</li>
                <li>ISO 8601: 2021-01-01T00:00:00Z</li>
              </ul>
            </div>
          </div>
        );

      case 'URL Encoder/Decoder':
        return (
          <div className="space-y-4">
            <textarea
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter text to encode or URL-encoded string to decode..."
              className="w-full h-32 p-4 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
            <div className="flex gap-4">
              <button onClick={encodeURL} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80">
                Encode
              </button>
              <button onClick={decodeURL} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80">
                Decode
              </button>
            </div>
            <textarea
              value={urlOutput}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-32 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Developer Tools</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Quick utilities for everyday development tasks. No data leaves your browser.
        </p>

        {!activeTool ? (
          <>
            {/* Category filter */}
            <div className="flex gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    activeCategory === cat
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tools grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => setActiveTool(tool.name)}
                  className="glass glass-hover rounded-lg p-6 text-left"
                >
                  <h3 className="font-semibold mb-2">{tool.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                  <span className={`inline-block mt-3 text-xs px-2 py-1 rounded-full ${
                    tool.category === 'converter' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                    tool.category === 'formatter' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                  }`}>
                    {tool.category}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setActiveTool('')}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Back to tools
            </button>
            <div className="glass rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">{activeTool}</h2>
              {renderTool()}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>All tools run entirely in your browser. No data is sent to any server.</p>
        </div>
      </div>
    </main>
  );
}
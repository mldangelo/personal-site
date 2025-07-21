'use client';

import React, { useState } from 'react';
import Main from '@/layouts/Main';
import SyntaxHighlighter from '@/components/SyntaxHighlighter/SyntaxHighlighter';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  category: string;
}

const snippets: CodeSnippet[] = [
  {
    id: 'react-debounce-hook',
    title: 'React Debounce Hook',
    description: 'Custom hook for debouncing values in React',
    language: 'typescript',
    category: 'React',
    tags: ['React', 'Hooks', 'Performance'],
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage:
// const debouncedSearchTerm = useDebounce(searchTerm, 500);`,
  },
  {
    id: 'python-retry-decorator',
    title: 'Python Retry Decorator',
    description: 'Decorator for retrying functions with exponential backoff',
    language: 'python',
    category: 'Python',
    tags: ['Python', 'Decorators', 'Error Handling'],
    code: `import time
from functools import wraps
from typing import Callable, Any

def retry(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Retry decorator with exponential backoff."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            attempt = 0
            current_delay = delay
            
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    if attempt >= max_attempts:
                        raise e
                    
                    print(f"Attempt {attempt} failed: {e}")
                    print(f"Retrying in {current_delay} seconds...")
                    time.sleep(current_delay)
                    current_delay *= backoff
            
        return wrapper
    return decorator

# Usage:
# @retry(max_attempts=3, delay=1.0, backoff=2.0)
# def fetch_data():
#     return requests.get('https://api.example.com/data')`,
  },
  {
    id: 'rust-result-combinator',
    title: 'Rust Result Combinator Pattern',
    description: 'Elegant error handling with Result combinators',
    language: 'rust',
    category: 'Rust',
    tags: ['Rust', 'Error Handling', 'Functional'],
    code: `use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    File::open("username.txt")?
        .read_to_string(&mut String::new())
        .map(|_| username.trim().to_string())
}

// Or using combinators:
fn read_and_process() -> Result<i32, Box<dyn std::error::Error>> {
    std::fs::read_to_string("number.txt")
        .map_err(|e| e.into())
        .and_then(|s| s.trim().parse::<i32>().map_err(|e| e.into()))
        .map(|n| n * 2)
}`,
  },
  {
    id: 'bash-parallel-jobs',
    title: 'Bash Parallel Job Execution',
    description: 'Run multiple commands in parallel with job control',
    language: 'bash',
    category: 'DevOps',
    tags: ['Bash', 'Parallel', 'Performance'],
    code: `#!/bin/bash

# Function to run jobs in parallel with a limit
run_parallel() {
    local max_jobs=$1
    shift
    
    for cmd in "$@"; do
        # Wait if we've hit the job limit
        while [ $(jobs -r | wc -l) -ge $max_jobs ]; do
            sleep 0.1
        done
        
        # Run command in background
        eval "$cmd" &
    done
    
    # Wait for all jobs to complete
    wait
}

# Example usage:
commands=(
    "sleep 2 && echo 'Task 1 done'"
    "sleep 3 && echo 'Task 2 done'"
    "sleep 1 && echo 'Task 3 done'"
    "sleep 2 && echo 'Task 4 done'"
)

echo "Running ${#commands[@]} tasks with max 2 parallel jobs..."
run_parallel 2 "${commands[@]}"
echo "All tasks completed!"`,
  },
  {
    id: 'sql-window-functions',
    title: 'SQL Window Functions',
    description: 'Advanced analytics with window functions',
    language: 'sql',
    category: 'Database',
    tags: ['SQL', 'Analytics', 'PostgreSQL'],
    code: `-- Running totals and rankings
WITH sales_data AS (
    SELECT 
        date,
        product_id,
        revenue,
        -- Running total
        SUM(revenue) OVER (
            PARTITION BY product_id 
            ORDER BY date 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS running_total,
        -- Rank within product
        RANK() OVER (
            PARTITION BY product_id 
            ORDER BY revenue DESC
        ) AS revenue_rank,
        -- Percentage of total
        revenue / SUM(revenue) OVER (PARTITION BY product_id) * 100 AS pct_of_total
    FROM daily_sales
)
SELECT * FROM sales_data
WHERE revenue_rank <= 10
ORDER BY product_id, date;`,
  },
  {
    id: 'nextjs-api-middleware',
    title: 'Next.js API Middleware',
    description: 'Reusable middleware pattern for Next.js API routes',
    language: 'typescript',
    category: 'Next.js',
    tags: ['Next.js', 'API', 'Middleware'],
    code: `import { NextApiRequest, NextApiResponse } from 'next';

type Middleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => void;

function withMiddleware(...middlewares: Middleware[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const handlers = [...middlewares];
    
    const runMiddleware = (index: number) => {
      if (index >= handlers.length) return;
      
      const handler = handlers[index];
      handler(req, res, () => runMiddleware(index + 1));
    };
    
    runMiddleware(0);
  };
}

// Example middlewares
const cors: Middleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  next();
};

const auth: Middleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Verify token...
  next();
};

// Usage:
export default withMiddleware(cors, auth, async (req, res) => {
  res.json({ message: 'Protected endpoint' });
});`,
  },
];

const categories = ['All', ...Array.from(new Set(snippets.map(s => s.category)))];

const SnippetCard = ({ snippet }: { snippet: CodeSnippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{snippet.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {snippet.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="ml-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <CheckIcon className="w-5 h-5 text-green-500" />
            ) : (
              <ClipboardIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800">
        <SyntaxHighlighter language={snippet.language} code={snippet.code} />
      </div>
    </div>
  );
};

export default function SnippetsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesCategory = selectedCategory === 'All' || snippet.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Main>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Code Snippets</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Useful code snippets and patterns I've collected over the years.
          </p>
        </header>

        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No snippets found matching your search.
            </p>
          </div>
        )}
      </article>
    </Main>
  );
}
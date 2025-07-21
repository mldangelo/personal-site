'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { allPosts as posts } from '@/data/writing';
import projects from '@/data/projects';
import { galleries } from '@/data/photography';

interface SearchResult {
  title: string;
  description: string;
  link: string;
  type: 'post' | 'project' | 'photo' | 'page';
  date?: string;
  tags?: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);

  // All searchable content
  const searchableContent = useMemo(() => {
    const content: SearchResult[] = [];

    // Add blog posts
    posts.forEach(post => {
      content.push({
        title: post.title,
        description: post.description,
        link: post.link || '#',
        type: 'post',
        date: post.date,
        tags: post.tags,
      });
    });

    // Add projects
    projects.forEach(project => {
      content.push({
        title: project.title,
        description: project.desc,
        link: project.link || `/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'project',
        date: project.date,
      });
    });

    // Add photo galleries
    galleries.forEach(gallery => {
      content.push({
        title: `${gallery.name} Photography`,
        description: gallery.description,
        link: '/photography',
        type: 'photo',
        date: `${gallery.year}`,
      });
    });

    // Add static pages
    const staticPages = [
      {
        title: 'About',
        description: 'Learn about Michael D\'Angelo, his background, and experience',
        link: '/about',
        type: 'page' as const,
      },
      {
        title: 'Resume',
        description: 'Professional experience, education, and skills',
        link: '/resume',
        type: 'page' as const,
      },
      {
        title: 'Contact',
        description: 'Get in touch with Michael D\'Angelo',
        link: '/contact',
        type: 'page' as const,
      },
      {
        title: 'Now',
        description: 'What I\'m currently working on and thinking about',
        link: '/now',
        type: 'page' as const,
      },
      {
        title: 'Uses',
        description: 'Tools, software, and hardware I use daily',
        link: '/uses',
        type: 'page' as const,
      },
    ];

    content.push(...staticPages);
    return content;
  }, []);

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const searchResults = searchableContent.filter(item => {
      const searchText = `${item.title} ${item.description} ${item.tags?.join(' ') || ''}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });

    // Sort by relevance (title matches first, then by date)
    searchResults.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const queryLower = query.toLowerCase();

      // Exact title match
      if (aTitle === queryLower) return -1;
      if (bTitle === queryLower) return 1;

      // Title starts with query
      if (aTitle.startsWith(queryLower)) return -1;
      if (bTitle.startsWith(queryLower)) return 1;

      // Title contains query
      if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1;
      if (!aTitle.includes(queryLower) && bTitle.includes(queryLower)) return 1;

      // Sort by date (newer first)
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      return 0;
    });

    setResults(searchResults);
  }, [query, searchableContent]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return '📝';
      case 'project':
        return '🚀';
      case 'photo':
        return '📷';
      case 'page':
        return '📄';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return 'Blog Post';
      case 'project':
        return 'Project';
      case 'photo':
        return 'Photography';
      case 'page':
        return 'Page';
      default:
        return 'Page';
    }
  };

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Search</h1>

        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, projects, and more..."
              className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {query && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.map((result, index) => (
            <Link
              key={`${result.link}-${index}`}
              href={result.link}
              className="block glass glass-hover rounded-lg p-6 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">{getTypeIcon(result.type)}</span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{result.title}</h2>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{result.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    {result.date && <span>{new Date(result.date).toLocaleDateString()}</span>}
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex gap-2">
                        {result.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No results */}
        {query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No results found for "{query}"
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Try searching for different keywords or browse the{' '}
              <Link href="/writing" className="text-blue-600 dark:text-blue-400 hover:underline">
                blog
              </Link>{' '}
              or{' '}
              <Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline">
                projects
              </Link>.
            </p>
          </div>
        )}

        {/* Popular searches */}
        {!query && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {['AI', 'Security', 'Rust', 'Machine Learning', 'Startup', 'Open Source', 'Scale', 'Architecture'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
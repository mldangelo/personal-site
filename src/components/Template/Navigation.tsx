'use client';

import React, { useState, useRef, useEffect } from 'react';

import Link from 'next/link';

import { ThemeToggle } from '../Theme/ThemeToggle';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Main nav links - most important pages
  const mainLinks = [
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Resume' },
    { href: '/projects', label: 'Projects' },
    { href: '/writing', label: 'Writing' },
    { href: '/contact', label: 'Contact' },
  ];

  // Additional pages in dropdown
  const moreLinks = [
    { href: '/now', label: 'Now' },
    { href: '/uses', label: 'Uses' },
    { href: '/bookshelf', label: 'Bookshelf' },
    { href: '/timeline', label: 'Timeline' },
    { href: '/resume-interactive', label: 'Interactive Resume' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/talks', label: 'Talks' },
    { href: '/photography', label: 'Photography' },
    { href: '/stats', label: 'Stats' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tools', label: 'Tools' },
    { href: '/lab', label: 'Lab' },
    { href: '/terminal', label: 'Terminal' },
    { href: '/quest', label: 'Quest' },
    { href: '/press', label: 'Press Kit' },
  ];

  // All links for mobile menu
  const allLinks = [...mainLinks, ...moreLinks];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-200/20 dark:border-gray-800/20 px-6 py-4 sm:px-12 lg:px-16 no-print gpu-accelerated">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Michael D&apos;Angelo
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative hover:text-gray-600 dark:hover:text-gray-300 transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
            </Link>
          ))}
          
          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="relative hover:text-gray-600 dark:hover:text-gray-300 transition-colors group flex items-center gap-1"
            >
              More
              <svg
                className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-current transition-all group-hover:w-full"></span>
            </button>
            
            {isMoreOpen && (
              <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg overflow-hidden">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMoreOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <ThemeToggle />
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-800 px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-1">
            {allLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                {index === mainLinks.length && (
                  <div className="border-t border-gray-200 dark:border-gray-800 my-2 pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">More</p>
                  </div>
                )}
                <Link
                  href={link.href}
                  className="block py-2 hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navigation;

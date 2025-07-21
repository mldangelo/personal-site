'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { allPosts as posts } from '@/data/writing';
import projects from '@/data/projects';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  action: () => void;
  keywords?: string[];
  category: 'navigation' | 'action' | 'theme' | 'external';
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Commands
  const commands: Command[] = [
    // Navigation
    { id: 'home', title: 'Home', icon: '🏠', action: () => router.push('/'), category: 'navigation' },
    { id: 'about', title: 'About', icon: '👤', action: () => router.push('/about'), category: 'navigation' },
    { id: 'resume', title: 'Resume', icon: '📄', action: () => router.push('/resume'), category: 'navigation' },
    { id: 'resume-json', title: 'Resume (JSON)', icon: '🔧', action: () => router.push('/resume/json'), category: 'navigation' },
    { id: 'projects', title: 'Projects', icon: '🚀', action: () => router.push('/projects'), category: 'navigation' },
    { id: 'writing', title: 'Writing', icon: '✍️', action: () => router.push('/writing'), category: 'navigation' },
    { id: 'contact', title: 'Contact', icon: '📧', action: () => router.push('/contact'), category: 'navigation' },
    { id: 'search', title: 'Search', icon: '🔍', action: () => router.push('/search'), category: 'navigation' },
    { id: 'bookshelf', title: 'Bookshelf', icon: '📚', action: () => router.push('/bookshelf'), category: 'navigation' },
    { id: 'timeline', title: 'Timeline', icon: '📅', action: () => router.push('/timeline'), category: 'navigation' },
    { id: 'lab', title: 'Lab', icon: '🧪', action: () => router.push('/lab'), category: 'navigation' },
    { id: 'tools', title: 'Tools', icon: '🔧', action: () => router.push('/tools'), category: 'navigation' },
    { id: 'uses', title: 'Uses', icon: '💻', action: () => router.push('/uses'), category: 'navigation' },
    { id: 'now', title: 'Now', icon: '📍', action: () => router.push('/now'), category: 'navigation' },
    { id: 'resources', title: 'Resources', icon: '📦', action: () => router.push('/resources'), category: 'navigation' },
    { id: 'faq', title: 'FAQ', icon: '❓', action: () => router.push('/faq'), category: 'navigation' },
    { id: 'snippets', title: 'Code Snippets', icon: '💾', action: () => router.push('/snippets'), category: 'navigation' },
    { id: 'learning-path', title: 'Learning Paths', icon: '🎓', action: () => router.push('/learning-path'), category: 'navigation' },
    { id: 'case-studies', title: 'Case Studies', icon: '📊', action: () => router.push('/case-studies'), category: 'navigation' },
    { id: 'resume-interactive', title: 'Interactive Resume', icon: '🎯', action: () => router.push('/resume-interactive'), category: 'navigation' },
    { id: 'dashboard', title: 'Analytics Dashboard', icon: '📈', action: () => router.push('/dashboard'), category: 'navigation' },
    
    // Blog posts
    ...posts.slice(0, 5).map(post => ({
      id: `post-${post.title}`,
      title: post.title,
      subtitle: 'Blog Post',
      icon: '📝',
      action: () => router.push(post.link || '#'),
      keywords: post.tags,
      category: 'navigation' as const,
    })),
    
    // Projects
    ...projects.slice(0, 3).map(project => ({
      id: `project-${project.title}`,
      title: project.title,
      subtitle: 'Project',
      icon: '💡',
      action: () => window.open(project.link || '#', '_blank'),
      category: 'external' as const,
    })),
    
    // Actions
    {
      id: 'copy-email',
      title: 'Copy Email Address',
      icon: '📋',
      action: () => {
        navigator.clipboard.writeText('mdangelo@promptfoo.dev');
        setIsOpen(false);
      },
      category: 'action',
    },
    {
      id: 'download-resume',
      title: 'Download Resume',
      icon: '⬇️',
      action: () => {
        window.open('/resume.pdf', '_blank');
        setIsOpen(false);
      },
      category: 'action',
    },
    
    // Theme
    {
      id: 'theme-light',
      title: 'Switch to Light Mode',
      icon: '☀️',
      action: () => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsOpen(false);
      },
      category: 'theme',
    },
    {
      id: 'theme-dark',
      title: 'Switch to Dark Mode',
      icon: '🌙',
      action: () => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsOpen(false);
      },
      category: 'theme',
    },
    
    // External links
    {
      id: 'github',
      title: 'GitHub',
      subtitle: 'github.com/mldangelo',
      icon: '🐙',
      action: () => window.open('https://github.com/mldangelo', '_blank'),
      category: 'external',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      subtitle: 'linkedin.com/in/michaelldangelo',
      icon: '💼',
      action: () => window.open('https://www.linkedin.com/in/michaelldangelo', '_blank'),
      category: 'external',
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter(command => {
    const searchLower = search.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchLower) ||
      command.subtitle?.toLowerCase().includes(searchLower) ||
      command.keywords?.some(k => k.toLowerCase().includes(searchLower))
    );
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) acc[command.category] = [];
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  const categoryLabels = {
    navigation: 'Pages',
    action: 'Actions',
    theme: 'Theme',
    external: 'External Links',
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setSearch('');
        setSelectedIndex(0);
      }
      
      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      
      // Navigate with arrow keys
      if (isOpen && filteredCommands.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          filteredCommands[selectedIndex]?.action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Command Palette */}
      <div className="fixed inset-x-0 top-20 z-50 mx-auto max-w-2xl px-4">
        <div className="glass rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none"
            />
            <kbd className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
              ESC
            </kbd>
          </div>
          
          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto py-2">
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category}>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </div>
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command);
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={command.id}
                      onClick={() => {
                        command.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full px-4 py-2 flex items-center gap-3 transition-colors ${
                        isSelected
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                      }`}
                    >
                      <span className="text-lg">{command.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{command.title}</div>
                        {command.subtitle && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {command.subtitle}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <kbd className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                          ⏎
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
            
            {filteredCommands.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No commands found for "{search}"
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">⏎</kbd>
                to select
              </span>
            </div>
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">⌘K</kbd> to open
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import React from 'react';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import routes from '../../data/routes';
import { ThemeToggle } from '../Theme/ThemeToggle';
import HamburgerSheet from './HamburgerSheet';

const Navigation: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
    <div className="container mx-auto">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <h1 className="m-0">
          {routes
            .filter((l) => l.index)
            .map((l) => (
              <Link
                key={l.label}
                href={l.path}
                className="text-2xl font-black text-gray-900 dark:text-white hover:text-primary dark:hover:text-accent transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {routes
            .filter((l) => !l.index)
            .map((l) => (
              <Link
                key={l.label}
                href={l.path}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-accent transition-colors duration-200 group"
              >
                {l.icon && (
                  <FontAwesomeIcon
                    icon={l.icon}
                    className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-200"
                  />
                )}
                <span>{l.label}</span>
              </Link>
            ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <HamburgerSheet />
        </div>
      </div>
    </div>
  </header>
);

export default Navigation;

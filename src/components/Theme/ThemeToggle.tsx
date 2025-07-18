'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-background-alt transition-colors"
      aria-label="Toggle theme"
    >
      <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="w-5 h-5" />
    </button>
  );
}

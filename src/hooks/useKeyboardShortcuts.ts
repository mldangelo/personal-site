import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !shortcut.ctrl || !e.ctrlKey;
        const metaMatch = shortcut.meta ? e.metaKey : !shortcut.meta || !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !shortcut.shift || !e.shiftKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          metaMatch &&
          shiftMatch
        ) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Global keyboard shortcuts hook
export function useGlobalKeyboardShortcuts() {
  const router = useRouter();

  const shortcuts: Shortcut[] = [
    // Navigation
    { key: 'g', shift: true, action: () => router.push('/') }, // Shift+G -> Home
    { key: 'a', shift: true, action: () => router.push('/about') }, // Shift+A -> About
    { key: 'r', shift: true, action: () => router.push('/resume') }, // Shift+R -> Resume
    { key: 'p', shift: true, action: () => router.push('/projects') }, // Shift+P -> Projects
    { key: 'w', shift: true, action: () => router.push('/writing') }, // Shift+W -> Writing
    { key: 'c', shift: true, action: () => router.push('/contact') }, // Shift+C -> Contact
    
    // Search
    { key: '/', action: () => router.push('/search') }, // / -> Search
    
    // Theme toggle
    {
      key: 't',
      shift: true,
      action: () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);
}
'use client';

import { useCallback, useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/Icons';
import {
  DARK_SCHEME_QUERY,
  type ResolvedTheme,
  syncThemeColor,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from '@/lib/theme-color';

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ResolvedTheme | 'system' | null>(null);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme | null>(null);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // Storage can be unavailable; that visitor still follows the device.
    }

    setChoice(stored === 'light' || stored === 'dark' ? stored : 'system');

    const media = window.matchMedia?.(DARK_SCHEME_QUERY);
    const syncSystemTheme = () =>
      setSystemTheme(media?.matches ? 'dark' : 'light');

    syncSystemTheme();
    media?.addEventListener?.('change', syncSystemTheme);

    return () => media?.removeEventListener?.('change', syncSystemTheme);
  }, []);

  const resolvedTheme = choice === 'system' ? systemTheme : choice;

  useEffect(() => {
    if (resolvedTheme === null) return;

    document.documentElement.setAttribute(THEME_ATTRIBUTE, resolvedTheme);
    syncThemeColor(document);
  }, [resolvedTheme]);

  const toggle = useCallback(() => {
    if (resolvedTheme === null) return;

    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The current page can still change when persistence is unavailable.
    }
    setChoice(next);
  }, [resolvedTheme]);

  if (resolvedTheme === null) {
    return <div className="theme-toggle-placeholder" />;
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={
        resolvedTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      title={
        resolvedTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
    >
      <span className="theme-toggle-icon">
        {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

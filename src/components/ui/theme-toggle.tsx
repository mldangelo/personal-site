'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import useThemeStore, {
  type ResolvedTheme,
  resolveTheme
} from '@/store/theme-store';

const ThemeToggle = () => {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const [resolved, setResolved] = useState<ResolvedTheme | null>(null);

  // Resolved theme depends on the OS query, so it is only known client-side.
  useEffect(() => {
    setResolved(resolveTheme(preference));
  }, [preference]);

  const isDark = resolved === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  const Icon = isDark ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => setPreference(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className="icon-btn size-9"
    >
      {/* Rendered only once the client resolves the theme, avoiding a mismatched icon. */}
      {resolved && (
        <Icon
          aria-hidden="true"
          strokeWidth={1.75}
          className="size-[1.05rem]"
        />
      )}
    </button>
  );
};

export default ThemeToggle;

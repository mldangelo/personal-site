import { useEffect, useState } from 'react';
import useThemeStore, {
  type ResolvedTheme,
  resolveTheme
} from '../../store/theme-store';

const ThemeToggle = () => {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const [resolved, setResolved] = useState<ResolvedTheme | null>(null);

  // Resolved theme depends on the OS query, so it is only known client-side.
  useEffect(() => {
    setResolved(resolveTheme(preference));
  }, [preference]);

  const isDark = resolved === 'dark';

  return (
    <button
      type="button"
      onClick={() => setPreference(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid size-9 place-items-center border border-rule text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {/* Rendered only once the client resolves the theme, avoiding a mismatched icon. */}
      {resolved && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[1.05rem]"
          aria-hidden="true"
        >
          {isDark ? (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </>
          )}
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;

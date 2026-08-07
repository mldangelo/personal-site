import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useId, useState } from 'react';
import routes from '../../data/routes';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const current = pathname.toLowerCase();
  const isActive = (path: string) =>
    path === '/' ? current === '/index' || current === '/' : current === path;

  const indexRoute = routes.find((r) => r.index);
  const pageRoutes = routes.filter((r) => !r.index);

  useEffect(() => {
    // Close the mobile menu whenever navigation occurs.
    void pathname;
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
        {indexRoute && (
          <Link
            href={indexRoute.path}
            className="font-mono text-sm font-medium tracking-tight transition-colors hover:text-accent"
          >
            dase<span className="text-accent">.dev</span>
          </Link>
        )}

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {pageRoutes.map((r) => (
              <li key={r.label}>
                <Link
                  href={r.path}
                  aria-current={isActive(r.path) ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm transition-colors hover:text-accent ${
                    isActive(r.path)
                      ? 'bg-accent-subtle font-medium text-accent'
                      : 'text-muted'
                  }`}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            className="grid size-9 place-items-center rounded-md border border-border text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="size-[1.05rem]"
              aria-hidden="true"
            >
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id={menuId}
          aria-label="Main"
          className="border-t border-border md:hidden"
        >
          <ul className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-3">
            {pageRoutes.map((r) => (
              <li key={r.label}>
                <Link
                  href={r.path}
                  aria-current={isActive(r.path) ? 'page' : undefined}
                  className={`block rounded-md px-3 py-2 transition-colors hover:text-accent ${
                    isActive(r.path)
                      ? 'bg-accent-subtle font-medium text-accent'
                      : 'text-muted'
                  }`}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navigation;

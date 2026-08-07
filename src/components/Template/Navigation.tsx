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
    <header className="sticky top-0 z-50 border-b border-rule bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-measure items-center justify-between gap-4 px-[22px] sm:px-10">
        {indexRoute && (
          <Link
            href={indexRoute.path}
            className="label font-semibold text-accent transition-opacity hover:opacity-80"
          >
            dase.dev
          </Link>
        )}

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {pageRoutes.map((r) => (
              <li key={r.label}>
                <Link
                  href={r.path}
                  aria-current={isActive(r.path) ? 'page' : undefined}
                  className={`block border-b pb-[3px] font-mono text-[0.72rem] tracking-nav uppercase transition-colors hover:border-accent hover:text-fg ${
                    isActive(r.path)
                      ? 'border-accent text-fg'
                      : 'border-transparent text-muted'
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
            className="grid size-9 place-items-center border border-rule text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
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
          className="border-t border-rule md:hidden"
        >
          <ul className="mx-auto flex max-w-measure flex-col px-[22px] py-2 sm:px-10">
            {pageRoutes.map((r) => (
              <li key={r.label}>
                <Link
                  href={r.path}
                  aria-current={isActive(r.path) ? 'page' : undefined}
                  className={`block px-2 py-2.5 font-mono text-[0.72rem] tracking-nav uppercase transition-colors hover:text-accent ${
                    isActive(r.path)
                      ? 'bg-accent-subtle text-accent'
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

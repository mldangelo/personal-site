'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import ThemeToggle from '@/components/ui/theme-toggle';
import routes from '@/data/routes';

const Navigation = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const indexRoute = routes.find((r) => r.index);
  const pageRoutes = routes.filter((r) => !r.index);

  // Close the mobile menu whenever navigation occurs.
  useEffect(() => setOpen(false), [pathname]);

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
                  aria-current={pathname === r.path ? 'page' : undefined}
                  className={`nav-link border-b pb-[3px] hover:border-accent hover:text-fg ${
                    pathname === r.path
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
            className="icon-btn size-9 md:hidden"
          >
            {open ? (
              <X
                aria-hidden="true"
                strokeWidth={1.75}
                className="size-[1.05rem]"
              />
            ) : (
              <Menu
                aria-hidden="true"
                strokeWidth={1.75}
                className="size-[1.05rem]"
              />
            )}
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
                  aria-current={pathname === r.path ? 'page' : undefined}
                  className={`nav-link px-2 py-2.5 hover:text-accent ${
                    pathname === r.path
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

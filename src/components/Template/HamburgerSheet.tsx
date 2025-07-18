'use client';

import React from 'react';

import Link from 'next/link';

import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import routes from '@/data/routes';
import { useMobileDetection } from '@/hooks/useMobileDetection';

const HamburgerSheet: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { isTouch } = useMobileDetection();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={`md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${
            isTouch ? 'active:scale-95' : ''
          }`}
          aria-label="Open menu"
        >
          <FontAwesomeIcon icon={open ? faTimes : faBars} className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] p-0 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800"
      >
        <nav className="pt-20">
          <ul className="list-none m-0 p-0">
            {routes.map((l, index) => (
              <li key={l.label}>
                <Link
                  href={l.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-primary dark:hover:text-accent transition-all duration-200 ${
                    isTouch ? 'active:bg-gray-100 dark:active:bg-gray-800' : ''
                  } ${index === 0 ? 'text-lg font-bold' : 'text-base'}`}
                >
                  {l.icon && (
                    <FontAwesomeIcon
                      icon={l.icon}
                      className={`${index === 0 ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400 dark:text-gray-600`}
                    />
                  )}
                  <span>{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerSheet;

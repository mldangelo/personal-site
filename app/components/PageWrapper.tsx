'use client';

import React, { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import SideBar from '@/components/Template/SideBar';

interface PageWrapperProps {
  children: React.ReactNode;
  fullPage?: boolean;
}

export default function PageWrapper({ children, fullPage = false }: PageWrapperProps) {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col lg:flex-row-reverse items-start max-w-[calc(100%-17em)] mx-auto xl:max-w-[72em] lg:max-w-full min-h-screen">
      {!fullPage && (
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <SideBar />
        </aside>
      )}
      <main className="flex-1 w-full px-12 py-12 lg:px-10 lg:py-10 sm:px-8 sm:py-8 xs:px-6 xs:py-6">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

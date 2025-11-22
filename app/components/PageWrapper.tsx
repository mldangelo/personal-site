'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import SideBar from '@/components/Template/SideBar';

interface PageWrapperProps {
  children: React.ReactNode;
  fullPage?: boolean;
}

export default function PageWrapper({
  children,
  fullPage = false,
}: PageWrapperProps) {
  const pathname = usePathname();

  // Scroll to top on route change and announce to screen readers
  useEffect(() => {
    window.scrollTo(0, 0);

    // Announce page change to screen readers
    const announcement = document.getElementById('route-announcer');
    if (announcement) {
      announcement.textContent = `Navigated to ${pathname}`;
    }
  }, [pathname]);

  return (
    <>
      <div
        id="route-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <main id="main">{children}</main>
      {!fullPage && <SideBar />}
    </>
  );
}

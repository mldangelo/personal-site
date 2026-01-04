'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  fullPage?: boolean;
  hideFooter?: boolean;
}

export default function PageWrapper({
  children,
  fullPage = false,
  hideFooter = false,
}: PageWrapperProps) {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`page-container ${fullPage ? 'full-page' : ''}`}>
      <main className="page-main">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

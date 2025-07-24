'use client';

import React, { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import SideBar from '@/components/Template/SideBar';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect viewport width on the client only
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 960);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);


  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {!isMobile && <SideBar />}
      {isMobile && isHome && <SideBar showFooter={false} />}
      <div id="main">{children}</div>
      {isMobile && !isHome && <SideBar />}
    </>
  );
}

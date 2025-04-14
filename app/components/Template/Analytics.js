'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ReactGA from 'react-ga';

const Analytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Initialize GA if not already initialized
      if (!window.GA_INITIALIZED) {
        ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_ID);
        window.GA_INITIALIZED = true;
      }
      
      ReactGA.set({
        page: pathname,
      });
      ReactGA.pageview(pathname);
    }
  }, [pathname]);

  return null;
};

export default Analytics; 
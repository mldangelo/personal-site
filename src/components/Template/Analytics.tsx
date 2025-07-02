'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import ReactGA from 'react-ga';

const { NODE_ENV, NEXT_PUBLIC_GA_TRACKING_ID } = process.env;

if (NODE_ENV === 'production' && NEXT_PUBLIC_GA_TRACKING_ID) {
  ReactGA.initialize(NEXT_PUBLIC_GA_TRACKING_ID);
}

const Analytics: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (NODE_ENV === 'production' && NEXT_PUBLIC_GA_TRACKING_ID) {
      ReactGA.set({
        page: pathname,
      });
      ReactGA.pageview(pathname || '/');
    }
  }, [pathname]);

  return null;
};

export default Analytics;

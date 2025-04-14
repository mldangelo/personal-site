'use client';

import { useEffect } from 'react';
// Remove the import for usePathname since we're not using it
// import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
  // Remove the unused pathname declaration
  // const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, []); // Runs once on component mount

  return null;
};

export default ScrollToTop;

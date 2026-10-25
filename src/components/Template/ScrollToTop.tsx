'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Scrolls to top on route changes.
 *
 * Next leaves the scroll position alone when the incoming page's `<main>` is
 * already in view, and under a fixed header that is the case whenever the page
 * being left was scrolled by no more than the header's height. Without this, a
 * page opened from one scrolled 64px starts 64px down, its title under the
 * header.
 *
 * `instant`, so the reset cannot pick up the smooth scrolling a section-nav
 * click arms for its own jump (`src/lib/smoothScroll.ts`) when a route change
 * follows before that jump has finished.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial render to avoid unnecessary scroll on page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Instant scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

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
 *
 * It also moves focus into the new page when the change left it nowhere. A
 * link inside the page being left goes with that page, so focus falls back to
 * `<body>`, and the next Tab starts wherever the browser guesses. The new
 * page's `<main>` takes it instead, as it does from the skip link. A control
 * that outlives the change, such as a header link or the menu button, keeps
 * focus.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (document.activeElement === document.body) {
      document.querySelector('main')?.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}

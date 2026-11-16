'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Lets Back and Forward return to the entries that same-page links create.
 *
 * A fragment link, such as a section-nav jump or a footnote, adds a history
 * entry with no state, and the App Router ignores a traversal to an entry
 * without its state (`handlePopState` in Next's `app-router.js`). Back from
 * another page to `/resume/#skills` would change the URL and leave that other
 * page on screen. So each such entry takes the router's state for the page it
 * belongs to, read once the router has written it for the current path.
 */
export default function FragmentHistory() {
  const pathname = usePathname();

  useEffect(() => {
    const pageState = window.history.state;
    const onHashChange = () => {
      if (window.history.state === null && pageState !== null) {
        window.history.replaceState(pageState, '', window.location.href);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pathname]);

  return null;
}

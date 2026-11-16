'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { reloadPage } from '@/lib/reload';
import { withBasePath } from '@/lib/utils';

const samePath = (a: string, b: string) =>
  a.replace(/\/+$/, '') === b.replace(/\/+$/, '');

/**
 * Lets Back and Forward return to the entries that same-page links create.
 *
 * A fragment link, such as a section-nav jump or a footnote, adds a history
 * entry with no state, and the App Router ignores a traversal to an entry
 * without its state (`handlePopState` in Next's `app-router.js`). Back from
 * another page to `/resume/#skills` would change the URL and leave that other
 * page on screen. So each such entry takes the router's state for the page it
 * belongs to, read once the router has written it for the current path.
 *
 * An entry made before the page hydrated has no state either, and nothing was
 * listening to give it one. Jumping back to it from another page through the
 * history menu would show that page under the entry's URL, so a stateless
 * entry for a different page is loaded in full instead.
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

    const onPopState = (event: PopStateEvent) => {
      if (
        event.state === null &&
        !samePath(window.location.pathname, withBasePath(pathname))
      ) {
        reloadPage();
      }
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onPopState);
    };
  }, [pathname]);

  return null;
}

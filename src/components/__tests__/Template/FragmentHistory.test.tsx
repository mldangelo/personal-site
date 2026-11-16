import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { reloadPage } from '@/lib/reload';
import { withBasePath } from '@/lib/utils';
import FragmentHistory from '../../Template/FragmentHistory';

let pathname = '/resume/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));
vi.mock('@/lib/reload', () => ({ reloadPage: vi.fn() }));

describe('FragmentHistory', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    vi.mocked(reloadPage).mockClear();
  });

  it('gives a fragment jump the router state of the page it belongs to', () => {
    const routerState = { __NA: true, tree: ['resume'] };
    window.history.replaceState(routerState, '', '/resume/');
    render(<FragmentHistory />);

    // What a native same-page link leaves behind: a new entry with no state.
    window.history.pushState(null, '', '/resume/#skills');
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    expect(window.history.state).toEqual(routerState);
    expect(window.location.hash).toBe('#skills');
  });

  // Entries made before hydration have no state. One for this page is a
  // fragment the browser scrolls to; one for another page would otherwise
  // leave this page on screen under that page's URL.
  it.each([
    ['/resume/#skills', true],
    ['/about/#more', false],
  ])('loads a stateless entry for %s in full: %s', (url, reloads) => {
    pathname = '/about/';
    window.history.replaceState({ __NA: true }, '', withBasePath('/about/'));
    render(<FragmentHistory />);

    window.history.pushState(null, '', withBasePath(url));
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }));

    expect(vi.mocked(reloadPage).mock.calls.length > 0).toBe(reloads);
  });
});

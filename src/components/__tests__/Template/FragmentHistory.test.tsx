import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import FragmentHistory from '../../Template/FragmentHistory';

describe('FragmentHistory', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
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
});

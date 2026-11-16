import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ScrollToTop from '../../Template/ScrollToTop';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

function Page({ withControl }: { withControl?: boolean }) {
  return (
    <>
      {withControl ? <button type="button">Menu</button> : null}
      <main tabIndex={-1}>Page</main>
      <ScrollToTop />
    </>
  );
}

describe('ScrollToTop', () => {
  it('moves focus into the new page when the link that had it is gone', () => {
    pathname = '/';
    const { rerender } = render(<Page />);
    expect(document.activeElement).toBe(document.body);

    pathname = '/about/';
    rerender(<Page />);

    expect(document.activeElement).toBe(document.querySelector('main'));
  });

  it('leaves focus on a control that outlives the change', () => {
    pathname = '/';
    const { rerender, getByRole } = render(<Page withControl />);
    const control = getByRole('button', { name: 'Menu' });
    control.focus();

    pathname = '/about/';
    rerender(<Page withControl />);

    expect(document.activeElement).toBe(control);
  });
});

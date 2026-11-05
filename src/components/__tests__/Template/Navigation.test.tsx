import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Navigation from '../../Template/Navigation';

const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

function renderAt(pathname: string) {
  mockPathname.mockReturnValue(pathname);
  render(<Navigation />);

  return screen.getByRole('link', { name: /home/i });
}

describe('Navigation logo', () => {
  // GitHub Pages serves the homepage's file at all three, and the client router
  // reports the address bar. The HTML at each carries the monogram, so rendering
  // anything else there is a hydration error.
  it.each(['/', '/index', '/index.html'])(
    'is the monogram on the homepage, served at %s',
    (pathname) => {
      expect(renderAt(pathname)).toHaveTextContent(/^md$/);
    },
  );

  it.each(['/about', '/about/', '/about/index.html', '/no-such-page/'])(
    'is the name on %s',
    (pathname) => {
      const logo = renderAt(pathname);

      expect(logo).toHaveTextContent(/^Michael D’Angelo$/);
      expect(logo).toHaveAttribute('href', '/');
    },
  );

  // The data keeps the straight apostrophe that metadata and `resume.json`
  // match on, and the name a screen reader hears does not change with the page.
  it.each(['/', '/about/'])(
    'keeps the same accessible name on %s',
    (pathname) => {
      expect(renderAt(pathname)).toHaveAccessibleName(
        "Michael D'Angelo — home",
      );
    },
  );

  it('names the home entry of the mobile menu typographically', () => {
    renderAt('/');

    fireEvent.click(
      screen.getByRole('button', { name: 'Open navigation menu' }),
    );

    expect(
      screen.getByRole('link', { name: 'Michael D’Angelo' }),
    ).toHaveAttribute('href', '/');
  });
});

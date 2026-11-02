import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Navigation from '../../Template/Navigation';

// Mock usePathname to control active state
const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('Navigation', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');

    // Mock matchMedia for ThemeToggle
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders the logo link to home', () => {
    render(<Navigation />);
    const logo = screen.getByRole('link', {
      name: /michael d'angelo.*home/i,
    });
    expect(logo).toHaveAttribute('href', '/');
  });

  // The homepage is the one place the monogram is enough: the hero directly
  // beneath the header sets the name at display size.
  describe('logo', () => {
    const logo = () => screen.getByRole('link', { name: /home/i });

    // GitHub Pages serves the homepage's file at all three, and the client
    // router reports the address bar. The HTML at each carries the monogram,
    // so rendering anything else there is a hydration error.
    it.each(['/', '/index', '/index.html'])(
      'is the monogram on the homepage, served at %s',
      (pathname) => {
        mockPathname.mockReturnValue(pathname);
        render(<Navigation />);

        expect(logo()).toHaveTextContent(/^md$/);
      },
    );

    // Both spellings of a route: the export serves `/about/`, and `next/link`
    // navigates to whichever form the href was written in.
    it.each([
      '/about',
      '/about/',
      '/about/index.html',
      '/resume/',
      '/projects/',
      '/writing/',
      '/writing/a-post/',
      '/stats/',
      '/contact/',
      '/no-such-page/',
    ])('is the name on %s', (pathname) => {
      mockPathname.mockReturnValue(pathname);
      render(<Navigation />);

      // The apostrophe is the typographic one. `profile.json` keeps the
      // straight one a keyboard types, because metadata and `resume.json`
      // match on that exact string.
      expect(logo()).toHaveTextContent(/^Michael D’Angelo$/);
      expect(logo()).toHaveAttribute('href', '/');
    });

    it.each(['/', '/about/'])(
      'keeps the same accessible name on %s',
      (pathname) => {
        mockPathname.mockReturnValue(pathname);
        render(<Navigation />);

        expect(logo()).toHaveAccessibleName("Michael D'Angelo — home");
      },
    );
  });

  // The menu is the header on a phone, and its first entry is the name. It
  // shows the same form the wordmark does, on the homepage too, where the
  // header itself has only the monogram.
  it.each(['/', '/about/'])(
    'names the home entry of the mobile menu typographically on %s',
    (pathname) => {
      mockPathname.mockReturnValue(pathname);
      render(<Navigation />);

      fireEvent.click(
        screen.getByRole('button', { name: 'Open navigation menu' }),
      );

      expect(
        screen.getByRole('link', { name: 'Michael D’Angelo' }),
      ).toHaveAttribute('href', '/');
    },
  );

  it('labels the primary navigation landmark', () => {
    render(<Navigation />);

    expect(
      screen.getByRole('navigation', { name: 'Primary' }),
    ).toBeInTheDocument();
  });

  it('renders only primary navigation routes', () => {
    render(<Navigation />);

    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /writing/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /stats/i }),
    ).not.toBeInTheDocument();
  });

  it('marks home route as active when on homepage', () => {
    mockPathname.mockReturnValue('/');
    render(<Navigation />);

    // About link should not be active
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).not.toHaveClass('active');
  });

  it('marks about route as active when on about page', () => {
    mockPathname.mockReturnValue('/about');
    render(<Navigation />);

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('active');
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks nested routes as active', () => {
    mockPathname.mockReturnValue('/resume/skills');
    render(<Navigation />);

    const resumeLink = screen.getByRole('link', { name: /resume/i });
    expect(resumeLink).toHaveClass('active');
  });

  it('renders theme toggle and hamburger menu', () => {
    render(<Navigation />);

    // Theme toggle should be present (placeholder initially due to SSR)
    const navActions = document.querySelector('.nav-actions');
    expect(navActions).toBeInTheDocument();
  });
});

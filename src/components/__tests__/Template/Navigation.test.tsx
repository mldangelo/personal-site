import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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

  /**
   * "md" was the logo on every page, so an interior page never said whose
   * site it was above the fold — and `/contact`, which has no footer, never
   * said it at all. The homepage is the one place the monogram is enough: the
   * hero directly beneath the header sets the name at display size.
   */
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

  /**
   * The name is prepared by the server component and handed to the client
   * header as a string. When the client header called `smartQuotes` itself,
   * `typography.ts` joined the root layout's bundle and the build rewrote its
   * three `\p{L}` classes as literal Unicode ranges for the oldest browser the
   * production targets name: the layout chunk went from 8,651 bytes to 49,787
   * on every page. jsdom cannot see a bundle, so the guard is on the source —
   * and only on the header's own modules, which is where it was measured.
   */
  it('prepares the name on the server and keeps the helper out of the client header', () => {
    const source = (file: string) =>
      readFileSync(
        join(process.cwd(), 'src/components/Template', file),
        'utf8',
      );
    const CLIENT_DIRECTIVE = /^'use client';/;
    const TYPOGRAPHY_IMPORT = /from '[^']*\/typography'/;

    expect(source('Navigation.tsx')).not.toMatch(CLIENT_DIRECTIVE);
    expect(source('Navigation.tsx')).toMatch(TYPOGRAPHY_IMPORT);

    for (const file of ['SiteHeader.tsx', 'Hamburger.tsx']) {
      expect(source(file)).toMatch(CLIENT_DIRECTIVE);
      expect(source(file)).not.toMatch(TYPOGRAPHY_IMPORT);
    }
  });

  /**
   * The skip link is the first control a keyboard reaches on every page. It
   * was the last text on the site in tracked mono capitals, a page after the
   * navigation beside it moved to sentence case.
   */
  it('sets the skip link like the navigation it sits over', () => {
    const css = readFileSync(
      join(process.cwd(), 'app/styles/layout/header.css'),
      'utf8',
    ).replace(/\/\*[\s\S]*?\*\//g, '');
    const skipLink = /\.skip-link\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';

    expect(skipLink).toContain('font-family: var(--font-display);');
    expect(skipLink).toContain('font-size: var(--text-ui);');
    expect(skipLink).not.toContain('text-transform');
    expect(skipLink).not.toContain('letter-spacing');
  });

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

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { THEME_CHOICE_ATTRIBUTE } from '@/lib/theme';
import Hamburger from '../../Template/Hamburger';

const layoutCss = (file: string) =>
  readFileSync(join(process.cwd(), 'app/styles/layout', file), 'utf8');

/** header.css declares `.hamburger-button { display: flex }`; navigation.css
 *  gates it. Both have to be present for the gate to be tested against what
 *  actually competes with it in the bundle, and the gate must not depend on
 *  which of the two `@import` lines in app/tailwind.css comes first. */
const HEADER_CSS = layoutCss('header.css');
const NAVIGATION_CSS = layoutCss('navigation.css');

const IMPORT_ORDERS: [name: string, sheets: string[]][] = [
  ['header.css then navigation.css', [HEADER_CSS, NAVIGATION_CSS]],
  ['navigation.css then header.css', [NAVIGATION_CSS, HEADER_CSS]],
];

function injectSheets(sheets: string[]): () => void {
  const nodes = sheets.map((css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return style;
  });

  return () => {
    for (const node of nodes) node.remove();
  };
}

describe('Hamburger', () => {
  it('renders the hamburger button', () => {
    render(<Hamburger />);

    const button = screen.getByRole('button', {
      name: /open navigation menu/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('has correct initial aria attributes', () => {
    render(<Hamburger />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav-menu');
  });

  // Asserts the button's own `display`, not `toBeVisible()`: jsdom evaluates a
  // media list only when its text is literally `all` or `screen`, so it drops
  // header.css's `@media (max-width: 735px)` and leaves the ancestor
  // `.hamburger-container { display: none }` in force in every branch.
  it.each(IMPORT_ORDERS)(
    'stays hidden until the pre-paint bootstrap proves scripts ran (%s)',
    (_order, sheets) => {
      const root = document.documentElement;
      root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
      const removeSheets = injectSheets(sheets);

      try {
        render(<Hamburger />);
        const button =
          document.querySelector<HTMLButtonElement>('.hamburger-button');
        if (!button) throw new Error('no hamburger button rendered');

        expect(window.getComputedStyle(button).display).toBe('none');

        root.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
        expect(window.getComputedStyle(button).display).toBe('flex');
      } finally {
        root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
        removeSheets();
      }
    },
  );

  it('toggles menu open on click', () => {
    render(<Hamburger />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-label', 'Close navigation menu');
  });

  it('toggles menu closed on second click', () => {
    render(<Hamburger />);

    const button = screen.getByRole('button');
    fireEvent.click(button); // Open
    fireEvent.click(button); // Close

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-label', 'Open navigation menu');
  });

  it('shows hamburger icon when closed', () => {
    render(<Hamburger />);

    const icon = document.querySelector('.hamburger-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).not.toHaveClass('hamburger-icon--open');
  });

  it('changes icon to close state when open', () => {
    render(<Hamburger />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const icon = document.querySelector('.hamburger-icon');
    expect(icon).toHaveClass('hamburger-icon--open');
  });

  it('renders navigation links in slide menu', () => {
    render(<Hamburger />);

    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    // Check for navigation links
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /resume/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /archive/i }),
    ).not.toBeInTheDocument();
  });

  it('closes menu when a link is clicked', () => {
    render(<Hamburger />);

    // Open the menu
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Click a link
    const aboutLink = screen.getByRole('link', { name: /about/i });
    fireEvent.click(aboutLink);

    // Menu should be closed
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

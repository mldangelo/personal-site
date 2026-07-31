import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { THEME_CHOICE_ATTRIBUTE } from '@/lib/theme';
import Hamburger from '../../Template/Hamburger';

const NAVIGATION_CSS = readFileSync(
  join(process.cwd(), 'app/styles/layout/navigation.css'),
  'utf8',
);

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

  it('stays hidden until the pre-paint bootstrap proves scripts ran', () => {
    const root = document.documentElement;
    root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
    const style = document.createElement('style');
    style.textContent = NAVIGATION_CSS;
    document.head.appendChild(style);

    try {
      render(<Hamburger />);
      const button =
        document.querySelector<HTMLButtonElement>('.hamburger-button');

      expect(button).not.toBeNull();
      expect(button).not.toBeVisible();
      expect(
        screen.queryByRole('button', { name: 'Open navigation menu' }),
      ).toBeNull();

      root.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
      expect(button).toBeVisible();
      expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBe(
        button,
      );
    } finally {
      root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
      style.remove();
    }
  });

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

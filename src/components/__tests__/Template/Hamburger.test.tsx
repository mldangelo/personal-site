import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Hamburger from '../../Template/Hamburger';

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
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
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

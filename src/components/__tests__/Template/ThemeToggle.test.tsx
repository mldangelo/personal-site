import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ThemeToggle from '../../Template/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it('renders theme toggle button', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveClass('theme-toggle');
    });
  });

  it('uses dark mode when system prefers dark', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to light mode',
      );
    });
  });

  it('uses light mode when system prefers light', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to dark mode',
      );
    });
  });

  it('respects localStorage preference', async () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to dark mode',
      );
    });
  });

  it('toggles theme on click', async () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to light mode',
      );
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Switch to dark mode',
      );
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  it('updates document data-theme attribute', async () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });
});

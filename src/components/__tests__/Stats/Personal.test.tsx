import { act, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AGE_PRECISION_FULL } from '@/lib/telemetry';

import Personal from '../../Stats/Personal';

describe('Personal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the personal stats table', () => {
    render(<Personal />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays the current age label', () => {
    render(<Personal />);

    expect(screen.getByText('Current age')).toBeInTheDocument();
  });

  it('displays countries visited', () => {
    render(<Personal />);

    expect(screen.getByText('Countries visited')).toBeInTheDocument();
    expect(screen.getByText('53')).toBeInTheDocument();
  });

  it('displays current city', () => {
    render(<Personal />);

    expect(screen.getByText('Current city')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
  });

  it('has a link for countries visited', () => {
    render(<Personal />);

    const link = screen.getByRole('link', { name: /53/i });
    expect(link).toHaveAttribute(
      'href',
      'https://www.google.com/maps/d/embed?mid=1iBBTscqateQ93pWFVfHCUZXoDu8&z=2',
    );
  });

  it('ships a real age to readers with no JavaScript', () => {
    // The whole reason this stopped being a client component. Effects flush
    // during Testing Library's `render()`, so the unpowered markup — what
    // `out/stats/index.html` actually contains — has to be rendered this way.
    const html = renderToStaticMarkup(<Personal />);

    expect(html).not.toContain('--.-----------');
    expect(html).toMatch(/>\d+\.\d{2}</);
    expect(html).toMatch(/as of \d{4}-\d{2}-\d{2}/);
  });

  it('upgrades the age to full precision in the browser', () => {
    render(<Personal />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.querySelector('.stat-readout-value')?.textContent).toMatch(
      new RegExp(`^\\d+\\.\\d{${AGE_PRECISION_FULL}}$`),
    );
  });
});

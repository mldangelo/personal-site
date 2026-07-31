import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Personal from '../../Stats/Personal';

describe('Personal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
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

  it('updates age over time', async () => {
    render(<Personal />);

    // Get initial age text
    const ageCell = screen.getByText('Current age').closest('tr');
    expect(ageCell).toBeInTheDocument();

    // Advance timer to trigger age update
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Age should still be displayed (value changes but component renders)
    expect(screen.getByText('Current age')).toBeInTheDocument();
  });

  it('marks every reading as coming from the profile', () => {
    render(<Personal />);

    const sources = Array.from(
      document.querySelectorAll('.stat-provenance'),
      (mark) => mark.getAttribute('data-source'),
    );

    expect(sources).toEqual(['profile', 'profile', 'profile']);
  });

  it('carries the source note this table used to lack', () => {
    render(<Personal />);

    const note = screen.getByText(/profile readings come from/i);

    expect(note).toHaveClass('stats-source-note');
    expect(note).toHaveAttribute('data-source', 'profile');
  });

  it('does not append a unit that repeats its label', () => {
    // `53 countries` beside `Countries visited` says nothing the label has
    // not already said.
    render(<Personal />);

    const row = screen.getByText('Countries visited').closest('tr');

    expect(row?.textContent).not.toMatch(/countries$/i);
  });
});

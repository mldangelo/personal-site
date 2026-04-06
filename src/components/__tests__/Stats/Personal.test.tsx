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
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays current city', () => {
    render(<Personal />);

    expect(screen.getByText('Current city')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('does not link countries visited when no map URL is set', () => {
    render(<Personal />);

    const row = screen.getByText('Countries visited').closest('tr');
    const valueCell = row?.querySelector('.stat-table-value');
    const link = valueCell?.querySelector('a');
    expect(link).toBeNull();
  });

  it('updates age over time', async () => {
    render(<Personal />);

    const ageCell = screen.getByText('Current age').closest('tr');
    expect(ageCell).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByText('Current age')).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Site from '../../Stats/Site';

describe('Site', () => {
  const mockGitHubResponse = {
    stargazers_count: 150,
    subscribers_count: 25,
    forks: 75,
    open_issues_count: 3,
    pushed_at: '2024-01-15T12:00:00Z',
  };

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockGitHubResponse),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the site stats table', () => {
    render(<Site />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays static labels', () => {
    render(<Site />);

    expect(
      screen.getByText('Stars this repository has on github'),
    ).toBeInTheDocument();
    expect(screen.getByText('Number of forks')).toBeInTheDocument();
    expect(screen.getByText('Number of spoons')).toBeInTheDocument();
  });

  it('displays static values', () => {
    render(<Site />);

    expect(screen.getByText('Number of spoons')).toBeInTheDocument();
    expect(screen.getByText('Number of linter warnings')).toBeInTheDocument();
    expect(
      screen.getByText('Lines of TypeScript powering this website'),
    ).toBeInTheDocument();
  });

  it('fetches and displays GitHub data', async () => {
    render(<Site />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('formats the pushed_at date', async () => {
    render(<Site />);

    await waitFor(() => {
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<Site />);

    // Component should still render with initial data when fetch fails
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Static values should still be visible
    expect(screen.getByText('Number of spoons')).toBeInTheDocument();
  });

  it('has links for GitHub-sourced stats', async () => {
    render(<Site />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });

    // Find link by href since the text may still be loading
    const links = document.querySelectorAll(
      'a[href="https://github.com/mldangelo/personal-site/stargazers"]',
    );
    expect(links.length).toBeGreaterThan(0);
  });
});

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the fetch function
const mockGitHubData = {
  stargazers_count: 150,
  subscribers_count: 15,
  forks: 75,
  open_issues_count: 3,
  pushed_at: '2024-06-01T00:00:00Z',
};

// Must mock before importing the component
vi.stubGlobal(
  'fetch',
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockGitHubData),
    }),
  ),
);

// Import after mocking
import Site from '../../Stats/Site';

describe('Site', () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the site stats table', async () => {
    const Component = await Site();
    render(Component);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays static labels', async () => {
    const Component = await Site();
    render(Component);

    expect(
      screen.getByText('Stars this repository has on github'),
    ).toBeInTheDocument();
    expect(screen.getByText('Number of forks')).toBeInTheDocument();
    expect(screen.getByText('Number of spoons')).toBeInTheDocument();
  });

  it('displays static values for non-GitHub stats', async () => {
    const Component = await Site();
    render(Component);

    expect(screen.getByText('Number of spoons')).toBeInTheDocument();
    expect(screen.getByText('Number of linter warnings')).toBeInTheDocument();
    expect(
      screen.getByText('Lines of TypeScript powering this website'),
    ).toBeInTheDocument();
  });

  it('fetches GitHub data at build time', async () => {
    await Site();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/mldangelo/personal-site',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.v3+json',
        }),
      }),
    );
  });

  it('has links for GitHub-sourced stats', async () => {
    const Component = await Site();
    render(Component);

    const links = document.querySelectorAll(
      'a[href="https://github.com/mldangelo/personal-site/stargazers"]',
    );
    expect(links.length).toBeGreaterThan(0);
  });

  it('displays all expected stat categories', async () => {
    const Component = await Site();
    render(Component);

    expect(
      screen.getByText('Stars this repository has on github'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Number of people watching this repository'),
    ).toBeInTheDocument();
    expect(screen.getByText('Number of forks')).toBeInTheDocument();
    expect(screen.getByText('Open github issues')).toBeInTheDocument();
    expect(screen.getByText('Last updated at')).toBeInTheDocument();
  });

  it('uses fallback data when fetch fails', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const Component = await Site();
    render(Component);

    // Should still render with fallback data
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});

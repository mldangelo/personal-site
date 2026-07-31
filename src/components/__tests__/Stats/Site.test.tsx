import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the fetch function
const mockGitHubData = {
  stargazers_count: 1663,
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
      screen.getByText('Stars this repository has on GitHub'),
    ).toBeInTheDocument();
    expect(screen.getByText('Number of forks')).toBeInTheDocument();
    expect(screen.getByText('Number of spoons')).toBeInTheDocument();
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
      screen.getByText('Stars this repository has on GitHub'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Number of people watching this repository'),
    ).toBeInTheDocument();
    expect(screen.getByText('Number of forks')).toBeInTheDocument();
    expect(
      screen.getByText('Open GitHub issues and pull requests'),
    ).toBeInTheDocument();
    expect(screen.getByText('Last pushed')).toBeInTheDocument();
  });

  it('uses fallback data when fetch fails', async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const Component = await Site();
    render(Component);

    // Should still render with fallback data
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(/approximate github readings/i)).toHaveAttribute(
      'data-source',
      'fallback',
    );
  });

  it('labels live GitHub readings with their provenance', async () => {
    const Component = await Site();
    render(Component);

    expect(screen.getByText(/fetched at build time/i)).toHaveAttribute(
      'data-source',
      'github',
    );
  });

  it('no longer asserts a hand-typed linter-warning count', async () => {
    // `Number of linter warnings: '0'` was a number about this codebase typed
    // into a data file, four lines below the comment warning against exactly
    // that. It is replaced by counted rows.
    const Component = await Site();
    render(Component);

    expect(screen.queryByText(/linter warnings/i)).not.toBeInTheDocument();
  });

  it('counts the dependency and lint-rule figures at build time', async () => {
    const Component = await Site();
    render(Component);

    for (const label of [
      'Lines of TypeScript powering this website',
      'Dependencies declared directly',
      'Installed non-development package locations',
      'Lockfile package locations',
      'Biome lint rules enabled in CI',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('formats counts with a thousands separator', async () => {
    // `1663` and `53` were typographically interchangeable in an identical
    // mono cell; the separator is what restores magnitude at a glance.
    const Component = await Site();
    render(Component);

    expect(screen.getByText('1,663')).toBeInTheDocument();
  });

  it('gives counted rows a unit where the label does not name one', async () => {
    const Component = await Site();
    render(Component);

    const valueFor = (label: string) =>
      screen.getByText(label).closest('tr')?.querySelector('.stat-table-value')
        ?.textContent ?? '';

    expect(valueFor('Dependencies declared directly')).toMatch(
      /^[\d,]+ packages$/,
    );
    expect(valueFor('Installed non-development package locations')).toMatch(
      /^[\d,]+$/,
    );
    expect(valueFor('Lockfile package locations')).toMatch(/^[\d,]+$/);
    expect(valueFor('Biome lint rules enabled in CI')).toMatch(/^\d+$/);
    // The label already says "Lines of", so repeating the unit would be noise.
    expect(valueFor('Lines of TypeScript powering this website')).toMatch(
      /[\d,]+$/,
    );
  });

  it('does not link the build-host dependency count to the portable lockfile', async () => {
    const Component = await Site();
    render(Component);

    const value = screen
      .getByText('Installed non-development package locations')
      .closest('tr')
      ?.querySelector('.stat-table-value');

    expect(value?.querySelector('a')).toBeNull();
  });

  it('marks every reading with its provenance except the joke', async () => {
    const Component = await Site();
    render(Component);

    const sources = Array.from(
      document.querySelectorAll('.stat-provenance'),
      (mark) => mark.getAttribute('data-source'),
    );

    expect(new Set(sources)).toEqual(new Set(['github', 'measured']));

    // Every row but the joke carries a mark, and the joke carries none — it
    // measures nothing, so it has no source to name.
    const rows = document.querySelectorAll('tbody tr');
    expect(sources.length).toBe(rows.length - 1);
    expect(
      screen
        .getByText('Number of spoons')
        .closest('tr')
        ?.querySelector('.stat-provenance'),
    ).toBeNull();
  });
});

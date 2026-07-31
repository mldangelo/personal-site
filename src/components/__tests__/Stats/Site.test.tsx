import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockGitHubData = {
  stargazers_count: 1663,
  subscribers_count: 15,
  forks: 75,
  open_issues_count: 3,
  pushed_at: '2024-06-01T00:00:00Z',
};
const fetchMock = vi.fn();
const ENV_KEYS = [
  'BUILD_SHA',
  'BUILD_REPOSITORY',
  'GITHUB_SHA',
  'GITHUB_REPOSITORY',
] as const;
const originalEnvironment = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
);

vi.stubGlobal('fetch', fetchMock);

import Site from '../../Stats/Site';

function clearBuildEnvironment() {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

describe('Site', () => {
  beforeEach(() => {
    clearBuildEnvironment();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGitHubData),
    });
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = originalEnvironment[key];

      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('renders the site readings as a table', async () => {
    render(await Site());

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByText('Stars this repository has on GitHub'),
    ).toBeInTheDocument();
    expect(screen.getByText('Number of spoons')).toBeInTheDocument();
  });

  it('fetches the upstream repository at build time', async () => {
    await Site();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/mldangelo/personal-site',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.v3+json',
        }),
      }),
    );
  });

  it('labels the repository push precisely and links its activity', async () => {
    render(await Site());

    const row = screen.getByText('Latest repository push (UTC)').closest('tr');

    expect(screen.queryByText('Last updated at')).not.toBeInTheDocument();
    expect(row?.textContent).toContain('2024-06-01');
    expect(row?.querySelector('a')).toHaveAttribute(
      'href',
      'https://github.com/mldangelo/personal-site/activity',
    );
  });

  it('reports the exact commit this output was built from', async () => {
    const sha = '0123456789abcdef0123456789abcdef01234567';
    process.env.BUILD_SHA = sha;
    process.env.BUILD_REPOSITORY = 'mldangelo/personal-site';

    render(await Site());

    const row = screen.getByText('Built from commit').closest('tr');
    expect(row?.textContent).toContain('0123456');
    expect(row?.querySelector('a')).toHaveAttribute(
      'href',
      `https://github.com/mldangelo/personal-site/commit/${sha}`,
    );
    expect(screen.queryByText('Deployed from commit')).not.toBeInTheDocument();
  });

  it("keeps a fork build's commit and source links in the fork", async () => {
    const sha = 'fedcba9876543210fedcba9876543210fedcba98';
    process.env.GITHUB_SHA = sha;
    process.env.GITHUB_REPOSITORY = 'octocat/personal-site';

    render(await Site());

    expect(
      screen.getByText('Built from commit').closest('tr')?.querySelector('a'),
    ).toHaveAttribute(
      'href',
      `https://github.com/octocat/personal-site/commit/${sha}`,
    );
    expect(
      screen
        .getByText('Dependencies declared directly')
        .closest('tr')
        ?.querySelector('a'),
    ).toHaveAttribute(
      'href',
      `https://github.com/octocat/personal-site/blob/${sha}/package.json`,
    );
  });

  it('drops only the commit row when no build identity exists', async () => {
    render(await Site());

    expect(screen.queryByText('Built from commit')).not.toBeInTheDocument();
    expect(
      screen.getByText('Built on (UTC)').closest('tr')?.textContent,
    ).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('uses explicitly dated fallback data when the API fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    render(await Site());

    const note = screen.getByText(/fallback refreshed july 31, 2026/i);
    expect(note).toHaveAttribute('data-source', 'fallback');
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('explains which repository the GitHub readings describe', async () => {
    render(await Site());

    expect(
      screen.getByText(/github readings describe mldangelo\/personal-site/i),
    ).toHaveAttribute('data-source', 'github');
  });

  it('keeps the corrected dependency and lint labels from its live base', async () => {
    render(await Site());

    for (const label of [
      'Dependencies declared directly',
      'Installed non-development package locations',
      'Lockfile package locations',
      'Biome lint rules enabled in CI',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('formats only the direct dependency count with its non-repeated unit', async () => {
    render(await Site());

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
  });

  it('does not link the host-specific dependency count to the lockfile', async () => {
    render(await Site());

    expect(
      screen
        .getByText('Installed non-development package locations')
        .closest('tr')
        ?.querySelector('.stat-table-value a'),
    ).toBeNull();
  });

  it('marks every factual row with provenance and leaves the joke unmarked', async () => {
    render(await Site());

    const rows = document.querySelectorAll('tbody tr');
    const sources = document.querySelectorAll('.stat-provenance');

    expect(sources).toHaveLength(rows.length - 1);
    expect(
      screen
        .getByText('Number of spoons')
        .closest('tr')
        ?.querySelector('.stat-provenance'),
    ).toBeNull();
  });
});

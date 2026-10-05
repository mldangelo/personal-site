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
    vi.stubEnv('GITHUB_TOKEN', undefined);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGitHubData),
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it('still supports an explicitly supplied local read-only token', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-read-only-token');
    await Site();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/repos/mldangelo/personal-site',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-read-only-token',
        }),
      }),
    );
  });

  it('exports labeled fallback readings when anonymous requests are rate limited', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));
    render(await Site());
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(/fallback refreshed/i)).toHaveAttribute(
      'data-source',
      'fallback',
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

  it.each([
    ['invalid date', { ...mockGitHubData, pushed_at: 'not-a-date' }],
    [
      'impossible date',
      { ...mockGitHubData, pushed_at: '2024-02-30T00:00:00Z' },
    ],
    ['missing date', { ...mockGitHubData, pushed_at: undefined }],
    ['null date', { ...mockGitHubData, pushed_at: null }],
    ['numeric date', { ...mockGitHubData, pushed_at: 0 }],
    [
      'array date',
      { ...mockGitHubData, pushed_at: [mockGitHubData.pushed_at] },
    ],
    ['object date', { ...mockGitHubData, pushed_at: { toString: null } }],
    ['empty object', {}],
    ['array root', []],
    ['null root', null],
    ['primitive root', 'unexpected'],
    ...[
      'stargazers_count',
      'subscribers_count',
      'forks',
      'open_issues_count',
    ].flatMap((key) =>
      [
        undefined,
        null,
        '12',
        -1,
        0.5,
        Number.POSITIVE_INFINITY,
        { toString: null },
      ].map((value): [string, unknown] => [
        `${key}: ${JSON.stringify(value)}`,
        { ...mockGitHubData, [key]: value },
      ]),
    ),
  ])(
    'uses complete dated fallback for a malformed successful response: %s',
    async (_label, payload) => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => payload });
      render(await Site());
      expect(
        screen.getByText(/fallback refreshed july 31, 2026/i),
      ).toHaveAttribute('data-source', 'fallback');
      expect(
        screen.getByText('Latest repository push (UTC)').closest('tr'),
      ).toHaveTextContent('2026-07-31');
      expect(
        screen
          .getByText('Number of people watching this repository')
          .closest('tr'),
      ).toHaveTextContent('23');
      expect(screen.getByText('Built on (UTC)')).toBeInTheDocument();
    },
  );

  it('keeps zero counts and valid offset timestamps as live data', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        stargazers_count: 0,
        subscribers_count: 0,
        forks: 0,
        open_issues_count: 0,
        pushed_at: '2024-06-01T23:30:00-04:00',
      }),
    });
    render(await Site());
    expect(screen.getByText(/github readings describe/i)).toHaveAttribute(
      'data-source',
      'github',
    );
    expect(
      screen
        .getByText('Stars this repository has on GitHub')
        .closest('tr')
        ?.querySelector('.stat-table-value'),
    ).toHaveTextContent(/^0$/);
    expect(
      screen.getByText('Latest repository push (UTC)').closest('tr'),
    ).toHaveTextContent('2024-06-02');
  });

  it('falls back when a successful response is not JSON', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Invalid JSON');
      },
    });
    render(await Site());
    expect(screen.getByText(/fallback refreshed/i)).toHaveAttribute(
      'data-source',
      'fallback',
    );
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

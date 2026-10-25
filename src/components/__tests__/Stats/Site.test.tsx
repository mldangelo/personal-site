import { render, screen, within } from '@testing-library/react';
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

const FETCHED = 'From GitHub, fetched at build time';
const LAST_KNOWN = 'From GitHub, last known 2026-07-31';
const MEASURED = 'Measured from this build’s checkout';

/** The row labels under one caption, as a reader meets them. */
function rowsUnder(caption: string): (string | null)[] {
  return within(screen.getByRole('table', { name: caption }))
    .getAllByRole('rowheader')
    .map((header) => header.textContent);
}

/** The note a build leaves when it could not fetch GitHub's numbers. */
function fallbackNote(): HTMLElement {
  return screen.getByText(/could not be fetched when this site was built/i);
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

  it('sets each source in a table of its own, under a caption naming it', async () => {
    // One table used to hold all of these, with the source repeated as a tag
    // under every row. Which caption stands over which rows is the whole of
    // what a reader is now told about provenance, so it is pinned row by row.
    render(await Site());

    expect(rowsUnder(FETCHED)).toEqual([
      'GitHub stars',
      'Watchers',
      'Forks',
      'Open issues and pull requests',
      'Latest repository push (UTC)',
    ]);
    // No build identity here, so no "Built from commit" row.
    expect(rowsUnder(MEASURED)).toEqual([
      'Built on (UTC)',
      'Lines of TypeScript powering this site',
      'Direct dependencies',
      'Installed non-development package locations',
      'Lockfile package locations',
      'Biome lint rules enabled in CI',
    ]);
    expect(screen.getAllByRole('table')).toHaveLength(3);
  });

  it('exposes each table’s source to the stylesheet', async () => {
    render(await Site());

    expect(
      screen.getAllByRole('table').map((table) => table.dataset.source),
    ).toEqual(['github', 'measured', undefined]);
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
    expect(screen.getByRole('table', { name: LAST_KNOWN })).toHaveAttribute(
      'data-source',
      'fallback',
    );
    expect(fallbackNote()).toHaveAttribute('data-source', 'fallback');
  });

  it('never captions last-known numbers as fetched', async () => {
    // The caption sits directly over the numbers, so it is the first thing
    // that would lie. The other tables came from this build either way.
    fetchMock.mockRejectedValueOnce(new Error('Network error'));
    render(await Site());

    expect(screen.queryByText(/fetched at build time/i)).toBeNull();
    expect(rowsUnder(LAST_KNOWN)).toContain('GitHub stars');
    expect(screen.getByRole('table', { name: MEASURED })).toHaveAttribute(
      'data-source',
      'measured',
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
      screen.getByText('Direct dependencies').closest('tr')?.querySelector('a'),
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

    const note = fallbackNote();
    expect(note).toHaveAttribute('data-source', 'fallback');
    expect(note).toHaveTextContent(/approximate/i);
    expect(note).toHaveTextContent(/on 2026-07-31\.$/);
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
      expect(fallbackNote()).toHaveAttribute('data-source', 'fallback');
      expect(screen.getByRole('table', { name: LAST_KNOWN })).toHaveAttribute(
        'data-source',
        'fallback',
      );
      expect(
        screen.getByText('Latest repository push (UTC)').closest('tr'),
      ).toHaveTextContent('2026-07-31');
      expect(screen.getByText('Watchers').closest('tr')).toHaveTextContent(
        '23',
      );
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
    expect(screen.getByRole('table', { name: FETCHED })).toHaveAttribute(
      'data-source',
      'github',
    );
    expect(
      screen
        .getByText('GitHub stars')
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
    expect(fallbackNote()).toHaveAttribute('data-source', 'fallback');
  });

  it('explains which repository the GitHub readings describe', async () => {
    // A fork's build still reads the upstream repository, so the note under
    // the table is what keeps a fork from presenting these counts as its own.
    render(await Site());

    const note = screen.getByRole('table', {
      name: FETCHED,
    }).nextElementSibling;

    expect(note).toHaveClass('stats-source-note');
    expect(note).toHaveAttribute('data-source', 'github');
    expect(note).toHaveTextContent(
      /^These describe the mldangelo\/personal-site repository\.$/,
    );
  });

  it('names the repository and dates the numbers in the fallback note', async () => {
    // The note broke "personal-site" at its hyphen on phones, so the name and
    // the date each keep an element the stylesheet holds in one piece.
    fetchMock.mockRejectedValueOnce(new Error('Network error'));
    render(await Site());

    const note = fallbackNote();
    expect(
      screen.getByRole('table', { name: LAST_KNOWN }).nextElementSibling,
    ).toBe(note);
    expect(within(note).getByText('mldangelo/personal-site').tagName).toBe(
      'SPAN',
    );
    expect(within(note).getByText('2026-07-31').tagName).toBe('SPAN');
  });

  it('keeps the corrected dependency and lint labels from its live base', async () => {
    render(await Site());

    for (const label of [
      'Direct dependencies',
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

    expect(valueFor('Direct dependencies')).toMatch(/^[\d,]+ packages$/);
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

  it('files every factual row under a source and sets the joke apart', async () => {
    // The spoon count measures nothing. Under either caption above it, the
    // page would be claiming to have fetched or counted it.
    render(await Site());

    expect(rowsUnder('Not measured')).toEqual(['Number of spoons']);
    expect(
      screen.getByRole('table', { name: 'Not measured' }),
    ).not.toHaveAttribute('data-source');
  });
});

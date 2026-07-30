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
    // Tests in this file run shuffled, and the deployed-commit row is read from
    // the environment — a leaked stub would make an unrelated test depend on
    // whether it ran on CI.
    vi.unstubAllEnvs();
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
    expect(screen.getByText('Forks of this repository')).toBeInTheDocument();
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
      screen.getByText('People watching this repository'),
    ).toBeInTheDocument();
    expect(screen.getByText('Forks of this repository')).toBeInTheDocument();
    expect(
      screen.getByText('Issues and pull requests open on GitHub'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Last push to this repository'),
    ).toBeInTheDocument();
  });

  it('spells the brand GitHub everywhere the page says it', async () => {
    // `Stars this repository has on github` and `Open github issues and pull
    // requests` were the only lowercase brand in the entire export, on the one
    // page that is entirely about a GitHub repository. Case-sensitive on
    // purpose: `/github/i` passes against the bug.
    const Component = await Site();
    const { container } = render(Component);

    for (const element of container.querySelectorAll(
      '.stat-table-label-text, .stats-source-note',
    )) {
      expect(element.textContent, element.textContent ?? '').not.toContain(
        'github',
      );
    }
    // The URLs are untouched — only the copy changes.
    expect(
      container.querySelector('a[href*="github.com"]'),
    ).toBeInTheDocument();
  });

  it('does not pass off the last push as the deploy', async () => {
    // `Last updated at` showed GitHub's `pushed_at`, which is the repository's
    // last push on any branch. It is not the commit that produced these bytes,
    // and it runs ahead of the deploy whenever a push does not produce one.
    const Component = await Site();
    render(Component);

    expect(screen.queryByText('Last updated at')).not.toBeInTheDocument();
    expect(
      screen.getByText('Last push to this repository').closest('tr')
        ?.textContent,
    ).toContain('2024-06-01');
  });

  it('reports the commit the build was cut from, linked to itself', async () => {
    const sha = '0123456789abcdef0123456789abcdef01234567';
    vi.stubEnv('BUILD_SHA', sha);
    vi.stubEnv('BUILD_REPOSITORY', 'mldangelo/personal-site');

    const Component = await Site();
    render(Component);

    const row = screen.getByText('Deployed from commit').closest('tr');
    expect(row?.textContent).toContain('0123456');
    expect(row?.querySelector('a')).toHaveAttribute(
      'href',
      `https://github.com/mldangelo/personal-site/commit/${sha}`,
    );
  });

  it("links a fork's deployed commit to the fork", async () => {
    const sha = 'fedcba9876543210fedcba9876543210fedcba98';
    vi.stubEnv('BUILD_SHA', sha);
    vi.stubEnv('BUILD_REPOSITORY', 'octocat/personal-site');

    const Component = await Site();
    render(Component);

    expect(
      screen
        .getByText('Deployed from commit')
        .closest('tr')
        ?.querySelector('a'),
    ).toHaveAttribute(
      'href',
      `https://github.com/octocat/personal-site/commit/${sha}`,
    );
  });

  it('drops the commit row off CI rather than inventing one', async () => {
    // A local `npm run build` and `npm run dev` have no commit context. One
    // fewer reading is the honest outcome; a guess is not.
    vi.stubEnv('BUILD_SHA', '');
    vi.stubEnv('GITHUB_SHA', '');

    const Component = await Site();
    render(Component);

    expect(screen.queryByText('Deployed from commit')).not.toBeInTheDocument();
    // The build clock does not depend on a commit, so it stays.
    expect(screen.getByText('When this build ran')).toBeInTheDocument();
  });

  it('shows when the build ran, and lets the browser count from there', async () => {
    const Component = await Site();
    render(Component);

    const row = screen.getByText('When this build ran').closest('tr');

    expect(row?.querySelector('.stat-readout-value')).toBeInTheDocument();
    expect(row?.textContent).toMatch(
      /\d+d \d{2}:\d{2}:\d{2}|\d{2}:\d{2}:\d{2}/,
    );
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

  it('does not date the fallback note with a hand-typed refresh date', async () => {
    // "fallback refreshed July 25, 2026" was the snapshot's vintage typed a
    // second time in user-facing copy — free to drift from the numbers it
    // dated, and certain to go stale. Nothing here can honestly derive it: the
    // build clock is exactly the freshness this branch is admitting it lacks.
    // The vintage stays visible as the `pushed_at` row instead.
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

    const Component = await Site();
    render(Component);

    const note = screen.getByText(/approximate github readings/i);

    // Any typed date carries a year, so a four-digit run is the guard. A month
    // name is not — "may" is an ordinary word, and a negative assertion that
    // can fire on prose is a trap for whoever edits this copy next.
    expect(note.textContent).not.toMatch(/\d{4}/);
    // The reader is still told these are last-known values and that the date
    // shown in the table is part of the same snapshot.
    expect(note.textContent).toMatch(/last-known values/i);
    expect(note.textContent).toMatch(
      /push date above is part of that snapshot/i,
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
      'Installed to run in production',
      'Resolved into the lockfile',
      'Enforced by CI on every push',
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

    const rowFor = (label: string) =>
      screen.getByText(label).closest('tr')?.textContent ?? '';

    expect(rowFor('Resolved into the lockfile')).toMatch(/[\d,]+ packages$/);
    expect(rowFor('Enforced by CI on every push')).toMatch(/\d+ lint rules$/);
    // The label already says "Lines of", so repeating the unit would be noise.
    expect(rowFor('Lines of TypeScript powering this website')).toMatch(
      /[\d,]+$/,
    );
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

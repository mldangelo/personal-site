import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockGitHubData = {
  stargazers_count: 1663,
  subscribers_count: 15,
  forks: 75,
};
const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

import Site from '../../Stats/Site';

const API_URL = 'https://api.github.com/repos/mldangelo/personal-site';

/** The value cell beside a label, as a reader meets it. */
function valueFor(label: string): string | null | undefined {
  return screen.getByText(label).closest('tr')?.querySelector('td')
    ?.textContent;
}

/** The three GitHub counts, in the order the page shows them. */
function counts() {
  return ['GitHub stars', 'Watchers', 'Forks'].map(valueFor);
}

describe('Site', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_TOKEN', undefined);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGitHubData),
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows the readings a reader would care about, in order', async () => {
    render(await Site());

    expect(
      screen.getAllByRole('rowheader').map((header) => header.textContent),
    ).toEqual([
      'GitHub stars',
      'Watchers',
      'Forks',
      'Lines of TypeScript powering this site',
      'Number of spoons',
    ]);
    expect(counts()).toEqual(['1,663', '15', '75']);
    expect(valueFor('Lines of TypeScript powering this site')).toMatch(
      /^\d{1,3}(?:,\d{3})*$/,
    );
    expect(valueFor('Number of spoons')).toBe('0');
  });

  it('fetches the source repository at build time', async () => {
    await Site();

    expect(fetchMock).toHaveBeenCalledWith(
      API_URL,
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
      API_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-read-only-token',
        }),
      }),
    );
  });

  it('links each count to where it can be checked', async () => {
    render(await Site());

    expect(
      screen.getAllByRole('link').map((link) => link.getAttribute('href')),
    ).toEqual([
      'https://github.com/mldangelo/personal-site/stargazers',
      'https://github.com/mldangelo/personal-site/watchers',
      'https://github.com/mldangelo/personal-site/network',
      'https://github.com/mldangelo/personal-site',
    ]);
  });

  /**
   * Anonymous requests from CI are rate limited. Last-known counts are shown
   * as floors rather than as fetched numbers, so the page stays true without
   * a caveat beside it.
   */
  it('shows last-known counts as floors when the API refuses', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));
    render(await Site());

    expect(counts()).toEqual(['1,695+', '23+', '978+']);
  });

  it('shows floors when the request fails outright', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));
    render(await Site());

    expect(counts()).toEqual(['1,695+', '23+', '978+']);
  });

  it('shows floors when a successful response is not JSON', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });
    render(await Site());

    expect(counts()).toEqual(['1,695+', '23+', '978+']);
  });

  it.each([
    ['empty object', {}],
    ['array root', []],
    ['null root', null],
    ['primitive root', 'unexpected'],
    ...['stargazers_count', 'subscribers_count', 'forks'].flatMap((key) =>
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
    'shows floors for a malformed successful response: %s',
    async (_label, payload) => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => payload });
      render(await Site());

      expect(counts()).toEqual(['1,695+', '23+', '978+']);
    },
  );

  it('keeps zero counts as fetched data, not as a failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        stargazers_count: 0,
        subscribers_count: 0,
        forks: 0,
      }),
    });
    render(await Site());

    expect(counts()).toEqual(['0', '0', '0']);
  });
});

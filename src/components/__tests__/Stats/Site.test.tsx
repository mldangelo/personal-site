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

function valueFor(label: string) {
  return screen.getByText(label).closest('tr')?.querySelector('td')
    ?.textContent;
}

function counts() {
  return ['GitHub stars', 'Watchers', 'Forks'].map(valueFor);
}

function respondWith(payload: unknown) {
  return () =>
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => payload });
}

const MALFORMED = [
  undefined,
  null,
  '12',
  -1,
  0.5,
  Infinity,
  { toString: null },
];

describe('Site', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_TOKEN', undefined);
    fetchMock.mockReset();
    respondWith(mockGitHubData)();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows fetched counts, the measured line count, and the spoons', async () => {
    render(await Site());

    expect(counts()).toEqual(['1,663', '15', '75']);
    expect(valueFor('Lines of TypeScript powering this site')).toMatch(
      /^\d{1,3}(?:,\d{3})*$/,
    );
    expect(valueFor('Number of spoons')).toBe('0');
    expect(fetchMock.mock.lastCall?.[1].headers).not.toHaveProperty(
      'Authorization',
    );
  });

  it('sends a token when one is supplied', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-read-only-token');
    await Site();
    expect(fetchMock.mock.lastCall?.[1].headers).toMatchObject({
      Authorization: 'Bearer test-read-only-token',
    });
  });

  // Anonymous requests from CI are rate limited. Last-known counts are shown as
  // floors rather than as fetched numbers, so the page stays true.
  it.each<[string, () => void]>([
    [
      'the API refuses',
      () =>
        fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 })),
    ],
    [
      'the request fails outright',
      () => fetchMock.mockRejectedValueOnce(new Error('Network error')),
    ],
    [
      'a successful response is not JSON',
      () =>
        fetchMock.mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new SyntaxError('Unexpected token');
          },
        }),
    ],
    ['the payload is an empty object', respondWith({})],
    ['the payload is an array', respondWith([])],
    ['the payload is null', respondWith(null)],
    ['the payload is a string', respondWith('unexpected')],
    // Every count shares one check, so the last key stands in for all three.
    ...MALFORMED.map((value): [string, () => void] => [
      `forks is ${JSON.stringify(value)}`,
      respondWith({ ...mockGitHubData, forks: value }),
    ]),
  ])('shows floors when %s', async (_, arrange) => {
    fetchMock.mockReset();
    arrange();
    render(await Site());

    expect(counts()).toEqual(['1,695+', '23+', '978+']);
  });

  it('keeps zero counts as fetched data, not as a failure', async () => {
    fetchMock.mockReset();
    respondWith({ stargazers_count: 0, subscribers_count: 0, forks: 0 })();
    render(await Site());

    expect(counts()).toEqual(['0', '0', '0']);
  });
});

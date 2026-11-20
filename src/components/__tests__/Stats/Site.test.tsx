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

/** The value as a sighted reader sees it, without a link's hidden name. */
function valueFor(label: string) {
  const cell = screen
    .getByText(label)
    .closest('tr')
    ?.querySelector('td')
    ?.cloneNode(true) as HTMLElement | undefined;
  for (const hidden of cell?.querySelectorAll('.sr-only') ?? []) {
    hidden.remove();
  }
  return cell?.textContent;
}

function counts() {
  return ['GitHub stars', 'Watchers', 'Forks'].map(valueFor);
}

function respondWith(payload: unknown) {
  return () =>
    fetchMock.mockResolvedValueOnce({ ok: true, json: async () => payload });
}

describe('Site', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_TOKEN', undefined);
    fetchMock.mockReset();
    respondWith(mockGitHubData)();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('shows fetched counts, asking anonymously by default', async () => {
    render(await Site());

    expect(counts()).toEqual(['1,663', '15', '75']);
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
    ['the payload is an empty object', respondWith({})],
    // Every count shares one check, so the last key stands in for all three.
    [
      'a count is not a number',
      respondWith({ ...mockGitHubData, forks: '12' }),
    ],
  ])('shows floors when %s', async (_, arrange) => {
    fetchMock.mockReset();
    arrange();
    render(await Site());

    expect(counts()).toEqual(['1,600+', '20+', '970+']);
  });

  it('keeps zero counts as fetched data, not as a failure', async () => {
    fetchMock.mockReset();
    respondWith({ stargazers_count: 0, subscribers_count: 0, forks: 0 })();
    render(await Site());

    expect(counts()).toEqual(['0', '0', '0']);
  });
});

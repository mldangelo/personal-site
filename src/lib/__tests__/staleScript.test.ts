import { afterEach, describe, expect, it, vi } from 'vitest';

import { claimReload, isMissingScript } from '../staleScript';

const named = (name: string, message: string) =>
  Object.assign(new Error(message), { name });

describe('isMissingScript', () => {
  it.each([
    [named('ChunkLoadError', 'Loading chunk 912 failed.'), true],
    [
      new Error('Loading CSS chunk 31 failed.\n(/_next/static/css/a.css)'),
      true,
    ],
    [new TypeError('Failed to fetch dynamically imported module: /a.js'), true],
    [new Error('Cannot read properties of undefined'), false],
  ])('reads %s as %s', (error, expected) => {
    expect(isMissingScript(error)).toBe(expected);
  });
});

describe('claimReload', () => {
  afterEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  // A script missing from the new release too must end on the error page.
  it('reloads an address once in a short window', () => {
    expect(claimReload('https://example.com/a/', 0)).toBe(true);
    expect(claimReload('https://example.com/a/', 5_000)).toBe(false);
    expect(claimReload('https://example.com/b/', 5_000)).toBe(true);
    expect(claimReload('https://example.com/b/', 60_000)).toBe(true);
  });

  it('never reloads without storage to stop a loop', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(claimReload('https://example.com/a/', 0)).toBe(false);
  });
});

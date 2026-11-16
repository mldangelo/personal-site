import { describe, expect, it } from 'vitest';

import { parseSiteUrl, prefixBasePath } from '../site-url.mjs';

describe('parseSiteUrl', () => {
  it.each([
    [
      'https://example.com/',
      {
        origin: 'https://example.com',
        basePath: '',
        siteUrl: 'https://example.com',
      },
    ],
    [
      'https://user.github.io/personal-site/',
      {
        origin: 'https://user.github.io',
        basePath: '/personal-site',
        siteUrl: 'https://user.github.io/personal-site',
      },
    ],
  ])('reads %s', (homepage, expected) => {
    expect(parseSiteUrl(homepage)).toEqual(expected);
  });

  it.each([
    'http://example.com/',
    'https://user.github.io/personal-site',
    'https://example.com/?ref=1',
    'https://example.com/#top',
  ])('rejects %s', (homepage) => {
    expect(() => parseSiteUrl(homepage)).toThrow(/homepage must be/);
  });
});

describe('prefixBasePath', () => {
  it.each([
    ['/images/me.jpg', '/repo/images/me.jpg'],
    ['/', '/repo/'],
    ['#section', '#section'],
    ['https://example.com/a.png', 'https://example.com/a.png'],
    ['//cdn.example.com/a.png', '//cdn.example.com/a.png'],
    ['mailto:me@example.com', 'mailto:me@example.com'],
  ])('maps %s under /repo', (path, expected) => {
    expect(prefixBasePath('/repo', path)).toBe(expected);
  });
});

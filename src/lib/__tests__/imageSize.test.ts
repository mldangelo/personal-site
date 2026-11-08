import { describe, expect, it } from 'vitest';

import {
  parseImageSize,
  readImageSize,
  readPostImageSizes,
} from '../imageSize';

function png(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer);
  buffer.writeUInt32BE(13, 8);
  buffer.write('IHDR', 12, 'ascii');
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

/** A RIFF container holding one WebP chunk of the given encoding. */
function webp(encoding: 'VP8X' | 'VP8 ' | 'VP8L', length: number): Buffer {
  const buffer = Buffer.alloc(length);
  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(length - 8, 4);
  buffer.write('WEBP', 8, 'ascii');
  buffer.write(encoding, 12, 'ascii');
  buffer.writeUInt32LE(length - 20, 16);
  return buffer;
}

function extendedWebp(width: number, height: number): Buffer {
  const buffer = webp('VP8X', 30);
  buffer.writeUIntLE(width - 1, 24, 3);
  buffer.writeUIntLE(height - 1, 27, 3);
  return buffer;
}

function lossyWebp(width: number, height: number): Buffer {
  const buffer = webp('VP8 ', 30);
  buffer.set([0x9d, 0x01, 0x2a], 23);
  buffer.writeUInt16LE(width, 26);
  buffer.writeUInt16LE(height, 28);
  return buffer;
}

function losslessWebp(width: number, height: number): Buffer {
  const buffer = webp('VP8L', 25);
  buffer[20] = 0x2f;
  buffer.writeUInt32LE((width - 1) | ((height - 1) << 14), 21);
  return buffer;
}

const OG = { '/og.png': { width: 1200, height: 630 } };

describe('parseImageSize', () => {
  it.each([
    ['PNG', png(1117, 812), { width: 1117, height: 812 }],
    ['extended WebP', extendedWebp(1166, 656), { width: 1166, height: 656 }],
    ['lossy WebP', lossyWebp(747, 610), { width: 747, height: 610 }],
    ['lossless WebP', losslessWebp(320, 240), { width: 320, height: 240 }],
  ])('reads dimensions from a valid %s header', (_, buffer, expected) => {
    expect(parseImageSize(buffer)).toEqual(expected);
  });

  it.each([
    ['truncated PNG', png(20, 20).subarray(0, 20)],
    ['PNG without an IHDR chunk', Buffer.from(png(20, 20)).fill(0, 12, 16)],
    ['zero-width PNG', png(0, 20)],
    ['truncated WebP chunk', extendedWebp(20, 20).subarray(0, 29)],
    [
      'lossy WebP without its frame start code',
      Buffer.from(lossyWebp(20, 20)).fill(0, 23, 26),
    ],
    ['unknown data', Buffer.from('not an image')],
  ])('rejects %s', (_, buffer) => {
    expect(parseImageSize(buffer)).toBeNull();
  });
});

describe('readImageSize', () => {
  it('reads a real public image and ignores its query and fragment', () => {
    expect(readImageSize('/og.png?version=1#card')).toEqual(OG['/og.png']);
  });

  // An image the site renders. Deleting it reddens this test as well as the
  // export, so it must not point at a file no page uses.
  it('reads the WebP encoding used by article assets', () => {
    expect(
      readImageSize(
        '/images/writing/codex-desktop-app-post/codex-dark-mode-review.webp',
      ),
    ).toEqual({ width: 1166, height: 656 });
  });

  it.each([
    ['relative.png', /must be a root-relative URL/],
    ['//example.com/image.png', /must be a root-relative URL/],
    ['/../package.json', /outside public/],
    ['/%2e%2e/package.json', /outside public/],
    ['/missing-article-image.png', /does not exist/],
    ['/robots.txt', /unsupported or malformed header/],
  ])('fails the build for %s', (src, message) => {
    expect(() => readImageSize(src)).toThrow(message);
  });
});

describe('readPostImageSizes', () => {
  it.each([
    ['![plain](/og.png)'],
    ['![double](/og.png "Social card")'],
    ["![single](/og.png 'Social card')"],
    ['![parenthesized](</og.png> (Social card))'],
    ['![nested [alt]](/og.png)'],
    ['![reference][card]\n\n[card]: /og.png "Social card"'],
    ['<img alt="social > card" src="/og.png">'],
  ])('measures %s', (markdown) => {
    expect(readPostImageSizes(markdown)).toEqual(OG);
  });

  it('keeps query-bearing src values as renderer lookup keys', () => {
    expect(
      readPostImageSizes('![card](/og.png?v=2#preview "Version 2")'),
    ).toEqual({
      '/og.png?v=2#preview': OG['/og.png'],
    });
  });

  it.each([
    '![remote](https://example.com/image.png)',
    '![protocol relative](//example.com/image.png)',
    '![data](data:image/png;base64,AAAA)',
  ])('does not measure what public/ cannot hold: %s', (markdown) => {
    expect(readPostImageSizes(markdown)).toEqual({});
  });

  it.each([
    ['![relative](image.png)', /must be root-relative: image\.png/],
    ['![missing](/images/writing/gone.png "Gone")', /does not exist/],
  ])('fails the build for %s', (markdown, message) => {
    expect(() => readPostImageSizes(markdown)).toThrow(message);
  });

  it('lets only a missing draft image through the explicit preview option', () => {
    const preview = { allowMissingLocalImages: true };

    expect(readPostImageSizes('![gone](/gone.png)', preview)).toEqual({});
    expect(() => readPostImageSizes('![bad](/robots.txt)', preview)).toThrow(
      /unsupported or malformed header/,
    );
    expect(() =>
      readPostImageSizes('![up](/images/../robots.txt)', preview),
    ).toThrow(/outside public/);
  });
});

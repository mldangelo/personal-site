import { describe, expect, it } from 'vitest';

import {
  ImageSizeError,
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

function gif(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(10);
  buffer.write('GIF89a', 0, 'ascii');
  buffer.writeUInt16LE(width, 6);
  buffer.writeUInt16LE(height, 8);
  return buffer;
}

function extendedWebp(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(30);
  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write('WEBP', 8, 'ascii');
  buffer.write('VP8X', 12, 'ascii');
  buffer.writeUInt32LE(10, 16);
  buffer.writeUIntLE(width - 1, 24, 3);
  buffer.writeUIntLE(height - 1, 27, 3);
  return buffer;
}

function lossyWebp(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(30);
  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write('WEBP', 8, 'ascii');
  buffer.write('VP8 ', 12, 'ascii');
  buffer.writeUInt32LE(10, 16);
  buffer.set([0x9d, 0x01, 0x2a], 23);
  buffer.writeUInt16LE(width, 26);
  buffer.writeUInt16LE(height, 28);
  return buffer;
}

function losslessWebp(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(25);
  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write('WEBP', 8, 'ascii');
  buffer.write('VP8L', 12, 'ascii');
  buffer.writeUInt32LE(5, 16);
  buffer[20] = 0x2f;
  buffer.writeUInt32LE((width - 1) | ((height - 1) << 14), 21);
  return buffer;
}

function jpeg(width: number, height: number): Buffer {
  return Buffer.from([
    0xff,
    0xd8,
    // An APP0 segment exercises length-based skipping.
    0xff,
    0xe0,
    0x00,
    0x04,
    0x12,
    0x34,
    // JPEG permits fill bytes before the SOF marker.
    0xff,
    0xff,
    0xc2,
    0x00,
    0x08,
    0x08,
    (height >>> 8) & 0xff,
    height & 0xff,
    (width >>> 8) & 0xff,
    width & 0xff,
    0x00,
  ]);
}

describe('parseImageSize', () => {
  it.each([
    ['PNG', png(1117, 812), { width: 1117, height: 812 }],
    ['GIF', gif(640, 480), { width: 640, height: 480 }],
    ['extended WebP', extendedWebp(1166, 656), { width: 1166, height: 656 }],
    ['lossy WebP', lossyWebp(747, 610), { width: 747, height: 610 }],
    ['lossless WebP', losslessWebp(320, 240), { width: 320, height: 240 }],
    ['JPEG', jpeg(1024, 768), { width: 1024, height: 768 }],
  ])('reads dimensions from a valid %s header', (_, buffer, expected) => {
    expect(parseImageSize(buffer)).toEqual(expected);
  });

  it.each([
    ['truncated PNG', png(20, 20).subarray(0, 20)],
    ['PNG without an IHDR chunk', Buffer.from(png(20, 20)).fill(0, 12, 16)],
    ['zero-width GIF', gif(0, 20)],
    ['truncated WebP chunk', extendedWebp(20, 20).subarray(0, 29)],
    [
      'lossy WebP without its frame start code',
      Buffer.from(lossyWebp(20, 20)).fill(0, 23, 26),
    ],
    ['JPEG with a truncated segment', jpeg(20, 20).subarray(0, 17)],
    ['unknown data', Buffer.from('not an image')],
  ])('rejects %s', (_, buffer) => {
    expect(parseImageSize(buffer)).toBeNull();
  });
});

describe('readImageSize', () => {
  it('reads a real public image and ignores its query and fragment', () => {
    expect(readImageSize('/og.png?version=1#card')).toEqual({
      width: 1200,
      height: 630,
    });
  });

  it('reads the WebP encoding used by article assets', () => {
    expect(
      readImageSize(
        '/images/writing/codex-desktop-app-post/codex-app-overview.webp',
      ),
    ).toEqual({ width: 1166, height: 656 });
  });

  it.each([
    ['relative.png', 'INVALID_PATH'],
    ['//example.com/image.png', 'INVALID_PATH'],
    ['/../package.json', 'OUTSIDE_PUBLIC'],
    ['/%2e%2e/package.json', 'OUTSIDE_PUBLIC'],
    ['/missing-article-image.png', 'NOT_FOUND'],
    ['/robots.txt', 'UNSUPPORTED_OR_MALFORMED'],
  ])('reports a specific failure for %s', (src, code) => {
    expect.assertions(2);

    try {
      readImageSize(src);
    } catch (error) {
      expect(error).toBeInstanceOf(ImageSizeError);
      expect((error as ImageSizeError).code).toBe(code);
    }
  });
});

describe('readPostImageSizes', () => {
  it('measures root-local Markdown images with every supported title form', () => {
    const markdown = [
      '![plain](/og.png)',
      '![double](/og.png "Social card")',
      "![single](/og.png 'Social card')",
      '![parenthesized](</og.png> (Social card))',
    ].join('\n');

    expect(readPostImageSizes(markdown)).toEqual({
      '/og.png': { width: 1200, height: 630 },
    });
  });

  it('keeps query-bearing src values as renderer lookup keys', () => {
    expect(
      readPostImageSizes('![card](/og.png?v=2#preview "Version 2")'),
    ).toEqual({
      '/og.png?v=2#preview': { width: 1200, height: 630 },
    });
  });

  it('ignores images that cannot be measured from public/', () => {
    expect(
      readPostImageSizes(
        [
          '![remote](https://example.com/image.png)',
          '![protocol relative](//example.com/image.png)',
          '![data](data:image/png;base64,AAAA)',
          '![relative](image.png)',
        ].join('\n'),
      ),
    ).toEqual({});
  });

  it('fails the build for a missing root-local Markdown image', () => {
    expect(() =>
      readPostImageSizes(
        '![missing](/images/writing/definitely-missing.png "Missing")',
      ),
    ).toThrow(/Local image does not exist/);
  });
});

import { describe, expect, it } from 'vitest';

import {
  leadImageSource,
  parseImageSize,
  readImageSize,
  readPostImageSizes,
} from '../imageSize';

/** A RIFF container holding one WebP chunk of the given encoding. */
function webp(encoding: 'VP8X' | 'VP8L', length: number): Buffer {
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

function losslessWebp(width: number, height: number): Buffer {
  const buffer = webp('VP8L', 25);
  buffer[20] = 0x2f;
  buffer.writeUInt32LE((width - 1) | ((height - 1) << 14), 21);
  return buffer;
}

const OG = { '/og.png': { width: 1200, height: 630 } };

describe('parseImageSize', () => {
  it.each([
    ['extended WebP', extendedWebp(1166, 656), { width: 1166, height: 656 }],
    ['lossless WebP', losslessWebp(320, 240), { width: 320, height: 240 }],
  ])('reads dimensions from a valid %s header', (_, buffer, expected) => {
    expect(parseImageSize(buffer)).toEqual(expected);
  });

  it('rejects a truncated WebP chunk', () => {
    expect(parseImageSize(extendedWebp(20, 20).subarray(0, 29))).toBeNull();
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

  it('refuses an encoded path out of public/', () => {
    expect(() => readImageSize('/%2e%2e/package.json')).toThrow(
      /outside public/,
    );
  });
});

describe('readPostImageSizes', () => {
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
    expect(() => readPostImageSizes('![bad](/og.meta.json)', preview)).toThrow(
      /unsupported or malformed header/,
    );
    expect(() =>
      readPostImageSizes('![up](/images/../og.meta.json)', preview),
    ).toThrow(/outside public/);
  });
});

describe('leadImageSource', () => {
  const paragraph = 'A short paragraph.';

  it('names an image among the opening blocks, and nothing further down', () => {
    expect(
      leadImageSource(
        `## Context\n\n${paragraph}\n\n![lead](/images/lead.png)`,
      ),
    ).toBe('/images/lead.png');
    expect(
      leadImageSource(
        `${paragraph}\n\n${paragraph}\n\n${paragraph}\n\n![late](/images/late.png)`,
      ),
    ).toBeUndefined();
  });

  // A footnote example in a fence is text, wherever the fence falls.
  it('reads a fence past the window as one block', () => {
    expect(
      leadImageSource(
        `${paragraph}\n\n${paragraph}\n\n${paragraph}\n\n\`\`\`md\n[^1]: <iframe srcdoc="x"></iframe>\n\`\`\`\n`,
      ),
    ).toBeUndefined();
  });

  it('resolves a reference-style lead image defined further down', () => {
    expect(
      leadImageSource(
        `${paragraph}\n\n![lead][card]\n\n${paragraph}\n\n[card]: /images/card.png`,
      ),
    ).toBe('/images/card.png');
  });
});

import { describe, expect, it, vi } from 'vitest';

import { readImageSize } from '../imageSize';

const files = vi.hoisted(() => new Map<string, Buffer>());

// The files exist only in this suite's view of `public/`.
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    readFileSync: ((path: string, ...rest: unknown[]) => {
      const name = String(path).split('/public').pop() ?? '';
      return (
        files.get(name) ?? (actual.readFileSync as Function)(path, ...rest)
      );
    }) as typeof actual.readFileSync,
  };
});

const chunk = (type: string, data = Buffer.alloc(0)) => {
  const header = Buffer.alloc(8);
  header.writeUInt32BE(data.length, 0);
  header.write(type, 4, 'ascii');
  return Buffer.concat([header, data, Buffer.alloc(4)]);
};

function png(width: number, height: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', Buffer.alloc(16)),
    chunk('IEND'),
  ]);
}

/** A segment: marker, then a length that counts itself. */
const segment = (marker: number, data: Buffer) => {
  const header = Buffer.from([0xff, marker, 0, 0]);
  header.writeUInt16BE(data.length + 2, 2);
  return Buffer.concat([header, data]);
};

/** EXIF in big-endian TIFF, with one orientation entry. */
function exif(orientation: number): Buffer {
  const tiff = Buffer.alloc(26);
  tiff.write('MM', 0, 'ascii');
  tiff.writeUInt16BE(42, 2);
  tiff.writeUInt32BE(8, 4);
  tiff.writeUInt16BE(1, 8);
  tiff.writeUInt16BE(0x0112, 10);
  tiff.writeUInt16BE(3, 12);
  tiff.writeUInt32BE(1, 14);
  tiff.writeUInt16BE(orientation, 18);
  return Buffer.concat([Buffer.from('Exif\0\0', 'binary'), tiff]);
}

function jpeg(width: number, height: number, orientation?: number): Buffer {
  const frame = Buffer.alloc(15);
  frame[0] = 8;
  frame.writeUInt16BE(height, 1);
  frame.writeUInt16BE(width, 3);
  return Buffer.concat([
    Buffer.from([0xff, 0xd8]),
    ...(orientation ? [segment(0xe1, exif(orientation))] : []),
    segment(0xc0, frame),
    segment(0xda, Buffer.alloc(10)),
    Buffer.alloc(32, 0x11),
    Buffer.from([0xff, 0xd9]),
  ]);
}

describe('readImageSize', () => {
  it.each([
    ['a PNG', png(640, 360), { width: 640, height: 360 }],
    ['a JPEG', jpeg(1024, 768), { width: 1024, height: 768 }],
    [
      'a JPEG with an invalid orientation',
      jpeg(1024, 768, 9),
      { width: 1024, height: 768 },
    ],
    // A phone photo stored landscape and turned upright by its EXIF tag.
    [
      'a JPEG turned a quarter',
      jpeg(4032, 3024, 6),
      { width: 3024, height: 4032 },
    ],
  ])('measures %s', (_, bytes, expected) => {
    files.set('/fixture/image', bytes);

    expect(readImageSize('/fixture/image')).toEqual(expected);
  });

  // The header alone measures, and the browser then shows a broken image.
  it.each([
    ['PNG', png(640, 360).subarray(0, 24)],
    ['JPEG', jpeg(1024, 768).subarray(0, 40)],
  ])('stops the build on a truncated %s', (_, bytes) => {
    files.set('/fixture/cut', bytes);

    expect(() => readImageSize('/fixture/cut')).toThrow(/truncated|malformed/);
  });
});

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Intrinsic dimensions of an image in `public/`, read from its header.
 *
 * Article images used to be declared 1200x630 regardless of what they were,
 * so every one reserved the wrong aspect ratio and shifted the page when it
 * loaded. Real assets range from 929x259 to 1166x656.
 *
 * Hand-parsed rather than pulling in an image library: only the handful of
 * formats this repository actually contains need to work, and this runs at
 * build time on a static export.
 *
 * Server-only — reads the filesystem.
 */
export function readImageSize(publicPath: string): ImageSize | null {
  try {
    const buffer = readFileSync(
      join(process.cwd(), 'public', publicPath.replace(/^\//, '')),
    );

    return png(buffer) ?? webp(buffer) ?? gif(buffer) ?? jpeg(buffer);
  } catch {
    return null;
  }
}

function png(b: Buffer): ImageSize | null {
  // \x89PNG\r\n\x1a\n, then an IHDR chunk whose width/height start at byte 16.
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;

  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function gif(b: Buffer): ImageSize | null {
  if (b.length < 10 || b.toString('ascii', 0, 3) !== 'GIF') return null;

  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function webp(b: Buffer): ImageSize | null {
  if (
    b.length < 30 ||
    b.toString('ascii', 0, 4) !== 'RIFF' ||
    b.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return null;
  }

  const format = b.toString('ascii', 12, 16);

  // Extended: canvas size is stored minus one, as two 24-bit little-endian ints.
  if (format === 'VP8X') {
    return {
      width: 1 + (b.readUInt16LE(24) | (b[26] << 16)),
      height: 1 + (b.readUInt16LE(27) | (b[29] << 16)),
    };
  }

  // Lossy: 14 bits each, following the 3-byte start code.
  if (format === 'VP8 ') {
    return {
      width: b.readUInt16LE(26) & 0x3fff,
      height: b.readUInt16LE(28) & 0x3fff,
    };
  }

  // Lossless: 14 bits each, bit-packed across four bytes after the signature.
  if (format === 'VP8L') {
    const bits = b.readUInt32LE(21);

    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    };
  }

  return null;
}

function jpeg(b: Buffer): ImageSize | null {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;

  let offset = 2;
  while (offset < b.length - 9) {
    if (b[offset] !== 0xff) return null;

    const marker = b[offset + 1];
    // SOF0-SOF15, excluding the non-frame markers DHT/JPG/DAC.
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    ) {
      return {
        height: b.readUInt16BE(offset + 5),
        width: b.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + b.readUInt16BE(offset + 2);
  }

  return null;
}

/** Every image referenced by a Markdown document, measured. */
export function readPostImageSizes(
  markdown: string,
): Record<string, ImageSize> {
  const sizes: Record<string, ImageSize> = {};

  for (const [, src] of markdown.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)) {
    const size = readImageSize(src);
    if (size) {
      sizes[src] = size;
    }
  }

  return sizes;
}

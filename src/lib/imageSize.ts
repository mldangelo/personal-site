import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { isRootLocalImage } from './markdown';
import {
  readMarkdownImageSources,
  readMarkdownReferences,
} from './markdown-assets.mjs';

export interface ImageSize {
  width: number;
  height: number;
}

/** A local article image that cannot be safely measured at build time. */
class ImageSizeError extends Error {
  /** Set only for a missing file, the one failure a draft preview may skip. */
  readonly code?: 'NOT_FOUND';

  constructor(
    message: string,
    options?: ErrorOptions & { code?: 'NOT_FOUND' },
  ) {
    super(message, options);
    this.name = 'ImageSizeError';
    this.code = options?.code;
  }
}

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const JPEG_END = Buffer.from([0xff, 0xd9]);

function validSize(width: number, height: number): ImageSize | null {
  return width > 0 && height > 0 ? { width, height } : null;
}

/**
 * Reads intrinsic dimensions from a PNG, WebP, or JPEG header, the formats
 * posts use. `readImageSize` also checks that the rest of the file is there.
 */
export function parseImageSize(buffer: Buffer): ImageSize | null {
  return png(buffer) ?? webp(buffer) ?? jpeg(buffer);
}

/**
 * Whether a file's structure runs to its end: a PNG's chunks to `IEND`, a
 * WebP's RIFF length, a JPEG's end-of-image marker. Not a decode, but a file
 * cut short, which a browser shows as a broken image, fails it.
 */
function isComplete(buffer: Buffer): boolean {
  if (buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    let offset = PNG_SIGNATURE.length;
    while (offset + 12 <= buffer.length) {
      const length = buffer.readUInt32BE(offset);
      const type = buffer.toString('ascii', offset + 4, offset + 8);
      offset += 12 + length;
      if (type === 'IEND') return offset <= buffer.length;
    }
    return false;
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF') {
    return buffer.length >= 8 && buffer.readUInt32LE(4) + 8 <= buffer.length;
  }
  return buffer.lastIndexOf(JPEG_END) > 2;
}

/**
 * Intrinsic dimensions of a root-local image in `public/`.
 *
 * Failures are explicit. A Markdown typo should stop the static build instead of producing a broken image with invented
 * dimensions. Paths are normalized within `public/`, which prevents traversal
 * through `..` and encoded separators.
 *
 * Server-only — reads the filesystem.
 */
export function readImageSize(publicPath: string): ImageSize {
  const filePath = resolvePublicImage(publicPath);
  let buffer: Buffer;

  try {
    buffer = readFileSync(filePath);
  } catch (error) {
    const missing = getNodeErrorCode(error) === 'ENOENT';
    throw new ImageSizeError(
      missing
        ? `Local image does not exist: ${publicPath}`
        : `Local image could not be read: ${publicPath}`,
      { cause: error, code: missing ? 'NOT_FOUND' : undefined },
    );
  }

  const size = parseImageSize(buffer);
  if (!size) {
    throw new ImageSizeError(
      `Local image has an unsupported or malformed header: ${publicPath}`,
    );
  }
  if (!isComplete(buffer)) {
    throw new ImageSizeError(`Local image is truncated: ${publicPath}`);
  }

  return size;
}

function resolvePublicImage(publicPath: string): string {
  if (
    !publicPath.startsWith('/') ||
    publicPath.startsWith('//') ||
    publicPath.includes('\\') ||
    publicPath.includes('\0')
  ) {
    throw new ImageSizeError(
      `Local image path must be a root-relative URL: ${publicPath}`,
    );
  }

  let pathname: string;
  try {
    const rawPathname = publicPath.split(/[?#]/, 1)[0];
    pathname = decodeURIComponent(rawPathname);
  } catch (error) {
    throw new ImageSizeError(
      `Local image path is not a valid URL: ${publicPath}`,
      { cause: error },
    );
  }

  if (pathname.includes('\\') || pathname.includes('\0')) {
    throw new ImageSizeError(
      `Local image path contains an invalid separator: ${publicPath}`,
    );
  }

  const publicDirectory = resolve(process.cwd(), 'public');
  if (pathname.split('/').includes('..')) {
    throw new ImageSizeError(
      `Local image resolves outside public/: ${publicPath}`,
    );
  }

  return resolve(publicDirectory, `.${pathname}`);
}

function getNodeErrorCode(error: unknown): string | undefined {
  return error instanceof Error && 'code' in error
    ? String(error.code)
    : undefined;
}

function png(buffer: Buffer): ImageSize | null {
  // Signature, IHDR length/type, then its width and height.
  if (
    buffer.length < 24 ||
    !buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE) ||
    buffer.readUInt32BE(8) !== 13 ||
    buffer.toString('ascii', 12, 16) !== 'IHDR'
  ) {
    return null;
  }

  return validSize(buffer.readUInt32BE(16), buffer.readUInt32BE(20));
}

function webp(buffer: Buffer): ImageSize | null {
  if (
    buffer.length < 20 ||
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    return null;
  }

  const chunkLength = buffer.readUInt32LE(16);
  const chunkEnd = 20 + chunkLength;
  if (chunkEnd > buffer.length) {
    return null;
  }

  const format = buffer.toString('ascii', 12, 16);

  // Extended: canvas size is stored minus one as 24-bit little-endian ints.
  if (format === 'VP8X' && chunkLength >= 10) {
    return validSize(
      1 + buffer.readUIntLE(24, 3),
      1 + buffer.readUIntLE(27, 3),
    );
  }

  // Lossy: dimensions follow the mandatory 3-byte frame start code.
  if (
    format === 'VP8 ' &&
    chunkLength >= 10 &&
    buffer[23] === 0x9d &&
    buffer[24] === 0x01 &&
    buffer[25] === 0x2a
  ) {
    return validSize(
      buffer.readUInt16LE(26) & 0x3fff,
      buffer.readUInt16LE(28) & 0x3fff,
    );
  }

  // Lossless: dimensions are bit-packed after the 0x2f signature.
  if (format === 'VP8L' && chunkLength >= 5 && buffer[20] === 0x2f) {
    const bits = buffer.readUInt32LE(21);
    return validSize(1 + (bits & 0x3fff), 1 + ((bits >>> 14) & 0x3fff));
  }

  return null;
}

/**
 * A JPEG's size, from the first frame header (an SOF marker; C4, C8, and CC
 * share the range but are not frames). A photo whose EXIF orientation turns
 * it a quarter is displayed with its stored width and height swapped.
 */
function jpeg(buffer: Buffer): ImageSize | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let turned = false;
  let offset = 2;
  while (offset + 4 <= buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    // Fill bytes, and markers that stand alone with no length.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      offset += 2;
      continue;
    }
    // A scan or the end of the image before any frame header.
    if (marker === 0xda || marker === 0xd9) return null;

    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > buffer.length) return null;
    if (marker === 0xe1) {
      turned ||= exifQuarterTurn(buffer, offset + 4, offset + 2 + length);
    }
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      if (length < 7) return null;
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return turned ? validSize(height, width) : validSize(width, height);
    }
    offset += 2 + length;
  }
  return null;
}

/** Whether an APP1 segment's EXIF orientation is one of the quarter turns, 5 to 8. */
function exifQuarterTurn(buffer: Buffer, start: number, end: number): boolean {
  if (buffer.toString('binary', start, start + 6) !== 'Exif\0\0') return false;
  const tiff = start + 6;
  if (tiff + 8 > end) return false;
  const little = buffer.toString('ascii', tiff, tiff + 2) === 'II';
  const u16 = (at: number) =>
    little ? buffer.readUInt16LE(at) : buffer.readUInt16BE(at);
  const u32 = (at: number) =>
    little ? buffer.readUInt32LE(at) : buffer.readUInt32BE(at);

  const directory = tiff + u32(tiff + 4);
  if (directory + 2 > end) return false;
  for (let index = 0; index < u16(directory); index += 1) {
    const entry = directory + 2 + index * 12;
    if (entry + 12 > end) return false;
    if (u16(entry) === 0x0112) {
      const orientation = u16(entry + 8);
      return orientation >= 5 && orientation <= 8;
    }
  }
  return false;
}

interface ReadPostImageSizeOptions {
  /**
   * Drafts may deliberately refer to images kept outside public/. Let their
   * development preview render with a fallback ratio, without weakening the
   * published-post build boundary.
   */
  allowMissingLocalImages?: boolean;
}

/**
 * Measures every local image the Markdown renderer can emit.
 *
 * The renderer's parser resolves nested alt text, reference-style images, and
 * raw HTML before this boundary sees them. Remote, protocol-relative, and data
 * URLs stay with the renderer. Repository images must use unambiguous
 * root-relative public paths; published posts require every one to exist with
 * a supported, measurable header.
 */
export function readPostImageSizes(
  markdown: string,
  options: ReadPostImageSizeOptions = {},
): Record<string, ImageSize> {
  const sizes: Record<string, ImageSize> = {};

  for (const src of readMarkdownImageSources(markdown)) {
    if (isRootLocalImage(src)) {
      try {
        sizes[src] = readImageSize(src);
      } catch (error) {
        if (
          options.allowMissingLocalImages &&
          error instanceof ImageSizeError &&
          error.code === 'NOT_FOUND'
        ) {
          continue;
        }
        throw error;
      }
    } else if (!isExternalImage(src)) {
      throw new ImageSizeError(
        `Local article image path must be root-relative: ${src}`,
      );
    }
  }

  return sizes;
}

/**
 * How many Markdown blocks under a post's header still fall in the first
 * viewport: a heading and a couple of short paragraphs.
 */
const LEAD_IMAGE_BLOCKS = 3;

/**
 * The image a post shows within its first few blocks, which on a wide screen
 * is in the first viewport and usually its largest paint, so `PostContent`
 * preloads it there instead of waiting for lazy loading. Read from the parsed
 * document, so a fence is one block whatever it holds, and a reference-style
 * image resolves wherever its definition is.
 */
export function leadImageSource(markdown: string): string | undefined {
  return readMarkdownReferences(markdown, { blocks: LEAD_IMAGE_BLOCKS }).find(
    ({ kind }) => kind === 'image',
  )?.target;
}

function isExternalImage(src: string): boolean {
  return src.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(src);
}

import { readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

export interface ImageSize {
  width: number;
  height: number;
}

export type ImageSizeErrorCode =
  | 'INVALID_PATH'
  | 'NOT_FOUND'
  | 'OUTSIDE_PUBLIC'
  | 'UNREADABLE'
  | 'UNSUPPORTED_OR_MALFORMED';

/** A local article image that cannot be safely measured at build time. */
export class ImageSizeError extends Error {
  readonly code: ImageSizeErrorCode;
  readonly publicPath: string;

  constructor(
    code: ImageSizeErrorCode,
    publicPath: string,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ImageSizeError';
    this.code = code;
    this.publicPath = publicPath;
  }
}

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

function validSize(width: number, height: number): ImageSize | null {
  return width > 0 && height > 0 ? { width, height } : null;
}

/**
 * Reads intrinsic dimensions from a supported image header.
 *
 * This intentionally validates only the header needed for dimensions, not the
 * complete image payload. A corrupt body remains the browser/asset pipeline's
 * concern; a forged or truncated header is rejected here.
 */
export function parseImageSize(buffer: Buffer): ImageSize | null {
  return png(buffer) ?? webp(buffer) ?? gif(buffer) ?? jpeg(buffer);
}

/**
 * Intrinsic dimensions of a root-local image in `public/`.
 *
 * Unlike the old nullable API, failures are explicit. A Markdown typo should
 * stop the static build instead of producing a broken image with invented
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
    const code = getNodeErrorCode(error);
    throw new ImageSizeError(
      code === 'ENOENT' ? 'NOT_FOUND' : 'UNREADABLE',
      publicPath,
      code === 'ENOENT'
        ? `Local image does not exist: ${publicPath}`
        : `Local image could not be read: ${publicPath}`,
      { cause: error },
    );
  }

  const size = parseImageSize(buffer);
  if (!size) {
    throw new ImageSizeError(
      'UNSUPPORTED_OR_MALFORMED',
      publicPath,
      `Local image has an unsupported or malformed header: ${publicPath}`,
    );
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
      'INVALID_PATH',
      publicPath,
      `Local image path must be a root-relative URL: ${publicPath}`,
    );
  }

  let pathname: string;
  try {
    const rawPathname = publicPath.split(/[?#]/, 1)[0];
    pathname = decodeURIComponent(rawPathname);
  } catch (error) {
    throw new ImageSizeError(
      'INVALID_PATH',
      publicPath,
      `Local image path is not a valid URL: ${publicPath}`,
      { cause: error },
    );
  }

  if (pathname.includes('\\') || pathname.includes('\0')) {
    throw new ImageSizeError(
      'INVALID_PATH',
      publicPath,
      `Local image path contains an invalid separator: ${publicPath}`,
    );
  }

  const publicDirectory = resolve(process.cwd(), 'public');
  if (pathname.split('/').includes('..')) {
    throw new ImageSizeError(
      'OUTSIDE_PUBLIC',
      publicPath,
      `Local image resolves outside public/: ${publicPath}`,
    );
  }
  const unresolvedPath = resolve(publicDirectory, `.${pathname}`);

  if (!isWithin(publicDirectory, unresolvedPath)) {
    throw new ImageSizeError(
      'OUTSIDE_PUBLIC',
      publicPath,
      `Local image resolves outside public/: ${publicPath}`,
    );
  }

  return unresolvedPath;
}

function isWithin(directory: string, candidate: string): boolean {
  const pathFromDirectory = relative(directory, candidate);
  return (
    pathFromDirectory === '' ||
    (!pathFromDirectory.startsWith(`..${sep}`) &&
      pathFromDirectory !== '..' &&
      !isAbsolute(pathFromDirectory))
  );
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

function gif(buffer: Buffer): ImageSize | null {
  const signature = buffer.toString('ascii', 0, 6);
  if (
    buffer.length < 10 ||
    (signature !== 'GIF87a' && signature !== 'GIF89a')
  ) {
    return null;
  }

  return validSize(buffer.readUInt16LE(6), buffer.readUInt16LE(8));
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

function jpeg(buffer: Buffer): ImageSize | null {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== 0xffd8) {
    return null;
  }

  let offset = 2;
  while (offset < buffer.length) {
    // JPEG permits any number of 0xff fill bytes before a marker.
    while (offset < buffer.length && buffer[offset] === 0xff) {
      offset += 1;
    }
    if (offset >= buffer.length) {
      return null;
    }

    const marker = buffer[offset];
    offset += 1;

    // Byte stuffing is only valid inside scan data, which this parser never
    // enters. Standalone markers have no length field.
    if (marker === 0x00) {
      return null;
    }
    if (marker === 0xd9 || marker === 0xda) {
      return null;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      continue;
    }
    if (offset + 2 > buffer.length) {
      return null;
    }

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) {
      return null;
    }

    // SOF0-SOF15, excluding the non-frame markers DHT/JPG/DAC.
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    ) {
      if (segmentLength < 8) {
        return null;
      }
      return validSize(
        buffer.readUInt16BE(offset + 5),
        buffer.readUInt16BE(offset + 3),
      );
    }

    offset += segmentLength;
  }

  return null;
}

/**
 * Extracts root-local Markdown images, including optional CommonMark titles.
 *
 * Remote, protocol-relative, and data URLs are left to the renderer. Local
 * images are build inputs, so every one must exist and have a supported,
 * measurable header.
 */
export function readPostImageSizes(
  markdown: string,
): Record<string, ImageSize> {
  const sizes: Record<string, ImageSize> = {};
  const imagePattern =
    /!\[(?:\\.|[^\]\\])*\]\(\s*(?:<([^>\r\n]+)>|((?:\\.|[^\s()])+))(?:\s+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?\s*\)/g;

  for (const match of markdown.matchAll(imagePattern)) {
    const src = match[1] ?? match[2];
    if (isRootLocalImage(src)) {
      sizes[src] = readImageSize(src);
    }
  }

  return sizes;
}

export function isRootLocalImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

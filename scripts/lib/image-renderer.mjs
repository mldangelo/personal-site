import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Installed packages whose exact locked bytes can change rendered pixels.
 *
 * `next/og` bundles satori and the OG renderer, React supplies the element
 * tree, and the Node renderer dynamically loads Sharp when it is installed.
 * The lock entries are therefore inputs just as surely as the generator source
 * and fonts are.
 */
export const IMAGE_RENDERER_PACKAGES = ['next', 'react', 'sharp'];

/** Exact lockfile identities of the packages that render image pixels. */
export async function readImageRenderer(root = process.cwd()) {
  const lockPath = join(root, 'package-lock.json');
  let lock;

  try {
    lock = JSON.parse(await readFile(lockPath, 'utf8'));
  } catch (error) {
    throw new Error('Cannot read the image renderer from package-lock.json', {
      cause: error,
    });
  }

  return IMAGE_RENDERER_PACKAGES.map((name) => {
    const entry = lock?.packages?.[`node_modules/${name}`];
    if (
      typeof entry?.version !== 'string' ||
      typeof entry?.integrity !== 'string'
    ) {
      throw new Error(
        `package-lock.json has no complete node_modules/${name} lock entry for the image renderer`,
      );
    }

    return {
      name,
      version: entry.version,
      integrity: entry.integrity,
    };
  });
}

/** Prevent next/og from silently switching to its bundled WASM rasterizer. */
export async function requireSharp() {
  try {
    await import('sharp');
  } catch (error) {
    throw new Error(
      'Image generation requires Sharp as the rasterizer, and it is not installed. ' +
        'Reinstall without --omit=optional (`npm ci`) before generating or ' +
        'checking images.',
      { cause: error },
    );
  }
}

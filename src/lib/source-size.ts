import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_ROOT = 'src';
const EXTENSIONS = new Set(['.ts', '.tsx', '.css']);

/**
 * Counts lines of source under `src/` at build time. Replaces the hardcoded
 * figure the stats page used to carry, which drifted out of date immediately
 * (the data file had a standing TODO to automate it). Server-only: the App
 * Router lets this run during the build rather than being guessed by hand.
 */
export const countSourceLines = async (): Promise<number> => {
  const root = path.join(process.cwd(), SOURCE_ROOT);

  const walk = async (dir: string): Promise<number> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const counts = await Promise.all(
      entries.map(async (entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(full);
        if (!EXTENSIONS.has(path.extname(entry.name))) return 0;
        const contents = await fs.readFile(full, 'utf8');
        return contents.split('\n').length;
      })
    );
    return counts.reduce((total, n) => total + n, 0);
  };

  try {
    return await walk(root);
  } catch {
    return 0;
  }
};

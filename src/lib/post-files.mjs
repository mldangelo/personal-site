import fs from 'node:fs';
import { join, relative, sep } from 'node:path';

import { parseFrontmatter } from './frontmatter.mjs';
import { validatePostFrontmatterData } from './post-frontmatter.mjs';

/**
 * The post files in `content/writing/`, as every reader sees them: the site,
 * the share-card generator, and the export check. One listing, because a file
 * that one of them skipped and another read was either a post that vanished
 * without a word or a draft whose assets the check never saw.
 *
 * Throws on an entry none of them would publish: a folder, a symbolic link, or
 * a file that is not a lowercase, hyphenated `.md` name. Hidden files, such as
 * `.DS_Store`, are skipped.
 */
export function listPostFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))
    .map((entry) => {
      const path = join(directory, entry.name);
      const shown = relative(process.cwd(), path);

      if (entry.isDirectory()) {
        throw new Error(
          `${shown}/ is a folder. Posts are .md files directly in ${relative(process.cwd(), directory)}/.`,
        );
      }
      if (!entry.isFile()) {
        throw new Error(
          `${shown} is not a regular file. Commit the post itself, not a link to it.`,
        );
      }

      const slug = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/.exec(entry.name)?.[1];
      if (!slug) {
        throw new Error(
          `${shown} is not a post name the site can route. Name it in lowercase words joined by single hyphens, ending in .md.`,
        );
      }

      return { slug, path };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * One listed post, parsed and validated. `source` is its path from the
 * working directory, with forward slashes on every platform, and every
 * validation error names it.
 */
export function readPostFile({ slug, path }) {
  const source = relative(process.cwd(), path).split(sep).join('/');
  const { data, content } = parseFrontmatter(fs.readFileSync(path, 'utf8'));
  const frontmatter = validatePostFrontmatterData(data, source);
  return { slug, source, frontmatter, content };
}

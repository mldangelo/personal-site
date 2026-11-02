import matter from 'gray-matter';
import { dump, load } from 'js-yaml';

// gray-matter's default engine binds the removed safeLoad/safeDump API from its
// own js-yaml copy, pinned to 4.x by package.json overrides; it never parses here.
const options = { engines: { yaml: { parse: load, stringify: dump } } };

/** @param {string} source */
export function parseFrontmatter(source) {
  const { data, content } = matter(source, options);
  return { data, content };
}

/**
 * @param {string} content
 * @param {Record<string, unknown>} data
 */
export function stringifyFrontmatter(content, data) {
  return matter.stringify(content, data, options);
}

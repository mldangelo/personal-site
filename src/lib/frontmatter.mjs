import matter from 'gray-matter';
import { dump, load } from 'js-yaml';

// gray-matter's default engine still calls the removed safeLoad/safeDump API.
// js-yaml 4's load/dump are safe by default and avoid the old sprintf-js chain.
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

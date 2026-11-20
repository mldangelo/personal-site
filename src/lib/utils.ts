/**
 * Shared utility functions and constants
 */

import profile from '@/data/profile.json';
import packageJson from '../../package.json';
import { parseSiteUrl, prefixBasePath } from './site-url.mjs';

const site = parseSiteUrl(packageJson.homepage);

/**
 * The public URL with no trailing slash, from `homepage` in `package.json`,
 * base path included: `https://user.github.io/repo` on a project site.
 */
export const SITE_URL = site.siteUrl;

/** `''` at a root URL, `/repo` on a project site. */
export const BASE_PATH = site.basePath;

/** A root-relative path for a raw `src` or `href`, which Next does not prefix. */
export function withBasePath(path: string): string {
  return prefixBasePath(BASE_PATH, path);
}

export const AUTHOR_NAME = profile.name;
export const TWITTER_HANDLE = '@dangelosaurus';
/**
 * The portrait. Used for JSON-LD `image`, where the value should be a picture
 * of the person, not a designed card.
 */
export const SITE_IMAGE_PATH = '/images/me.jpg';
export const SITE_IMAGE_DIMENSIONS = {
  width: 1024,
  height: 1024,
} as const;

// Canonical one-line bio, shared across page metadata, OpenGraph, and JSON-LD.
export const SITE_DESCRIPTION =
  'Member of the Technical Staff at OpenAI, working on Promptfoo and other cyber products. Co-founded Promptfoo before it joined OpenAI in 2026.';

// Skill competency
export const MAX_COMPETENCY = 5;

/** A post's canonical URL, with the trailing slash the export writes. */
export function canonicalPostUrl(slug: string): string {
  return `${SITE_URL}/writing/${slug}/`;
}

export { formatDate, formatMonthYear } from './dates.mjs';

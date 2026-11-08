/**
 * The site's entry to the colour-token reader, which lives in plain ESM so the
 * Node generators import the same implementation. Server-only.
 */
export { readColorToken } from './color-token.mjs';

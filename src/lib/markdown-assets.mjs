import { parser, RuleType } from 'markdown-to-jsx/markdown';

/**
 * Resource-bearing HTML attributes accepted inside Markdown.
 *
 * `markdown-to-jsx` exposes raw HTML as AST nodes, so inspecting the parsed
 * attributes covers quoted `>` characters and other cases a tag regex cannot
 * safely recognize.
 */
const SINGLE_RESOURCE_ATTRIBUTES = new Set([
  'action',
  'background',
  'cite',
  'classid',
  'codebase',
  'data',
  'datasrc',
  'dynsrc',
  'formaction',
  'href',
  'longdesc',
  'lowsrc',
  'manifest',
  'poster',
  'profile',
  'src',
  'usemap',
  'xlink:href',
]);
const RESOURCE_LIST_ATTRIBUTES = new Set(['archive', 'ping']);
const SRCSET_ATTRIBUTES = new Set(['imagesrcset', 'srcset']);
const UNINSPECTABLE_RESOURCE_TAGS = new Set([
  'base',
  'embed',
  'iframe',
  'link',
  'object',
  'script',
  'style',
  'svg',
]);
const SAFE_RASTER_DATA_URL =
  /^data:image\/(?:avif|bmp|gif|jpeg|png|vnd\.microsoft\.icon|webp|x-icon)(?:[;,])/i;

/**
 * Parse a `srcset` value without silently dropping candidates.
 *
 * The HTML grammar permits commas inside data URLs. Those URLs never identify
 * repository files, but an ambiguous data URL could otherwise hide a later
 * local candidate. Requiring a descriptor before another candidate makes that
 * boundary explicit and fail-closed.
 */
export function parseSrcset(value) {
  const sources = [];
  let index = 0;

  while (index < value.length) {
    while (index < value.length && /[\t\n\f\r ,]/.test(value[index])) {
      index += 1;
    }
    if (index >= value.length) break;

    const startsWithData = value
      .slice(index, index + 5)
      .toLowerCase()
      .startsWith('data:');
    const urlStart = index;

    if (startsWithData) {
      while (index < value.length && !/[\t\n\f\r ]/.test(value[index])) {
        index += 1;
      }
    } else {
      while (index < value.length && !/[\t\n\f\r ,]/.test(value[index])) {
        index += 1;
      }
    }

    const url = value.slice(urlStart, index);
    if (!url) {
      throw new TypeError(`Invalid srcset candidate in: ${value}`);
    }

    while (index < value.length && /[\t\n\f\r ]/.test(value[index])) {
      index += 1;
    }

    const descriptorStart = index;
    let parentheses = 0;
    while (index < value.length) {
      const character = value[index];
      if (character === '(') parentheses += 1;
      if (character === ')') {
        parentheses -= 1;
        if (parentheses < 0) {
          throw new TypeError(`Invalid srcset descriptor in: ${value}`);
        }
      }
      if (character === ',' && parentheses === 0) break;
      index += 1;
    }
    if (parentheses !== 0) {
      throw new TypeError(`Invalid srcset descriptor in: ${value}`);
    }

    const descriptors = value
      .slice(descriptorStart, index)
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (
      descriptors.length > 1 ||
      (descriptors[0] &&
        !/^(?:\d+w|\d+h|(?:\d+(?:\.\d+)?|\.\d+)x)$/.test(descriptors[0]))
    ) {
      throw new TypeError(`Invalid srcset descriptor in: ${value}`);
    }
    if (startsWithData && !descriptors.length && index < value.length) {
      throw new TypeError(
        `Ambiguous data URL in srcset; add a descriptor before another candidate: ${value}`,
      );
    }

    sources.push(url);
    if (value[index] === ',') index += 1;
  }

  return sources;
}

/**
 * Every URL-like resource the Markdown renderer can cause a browser to fetch.
 *
 * Reference-style Markdown has already been resolved by the parser. A generic
 * AST walk is deliberate: lists, tables, block quotes, and inline formatting
 * store descendants under different fields.
 */
export function readMarkdownReferences(markdown) {
  const references = [];
  const seen = new Set();

  function add(kind, target) {
    if (typeof target !== 'string' || target.trim() === '') return;
    const normalized = target.trim();
    if (/^data:/i.test(normalized) && !SAFE_RASTER_DATA_URL.test(normalized)) {
      throw new TypeError(
        'Only raster image data URLs are allowed in Markdown; active data documents can hide unverified resource fetches',
      );
    }
    const key = `${kind}\0${normalized}`;
    if (seen.has(key)) return;
    seen.add(key);
    references.push({ kind, target: normalized });
  }

  function visit(value) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!value || typeof value !== 'object') return;

    if (value.type === RuleType.image) {
      add('image', value.target);
    } else if (value.type === RuleType.link) {
      add('link', value.target);
    } else if (
      value.type === RuleType.htmlBlock ||
      value.type === RuleType.htmlSelfClosing
    ) {
      const tag = String(value.tag ?? '').toLowerCase();
      const attributes = new Map(
        Object.entries(value.attrs ?? {}).map(([name, attributeValue]) => [
          name.toLowerCase(),
          attributeValue,
        ]),
      );

      if (UNINSPECTABLE_RESOURCE_TAGS.has(tag)) {
        throw new TypeError(
          `Raw <${tag}> is not allowed in Markdown because its resource fetches cannot be verified`,
        );
      }
      if (attributes.has('style')) {
        throw new TypeError(
          'Raw HTML style attributes are not allowed in Markdown because CSS resource fetches cannot be verified without a CSS parser',
        );
      }
      if (
        typeof attributes.get('srcdoc') === 'string' &&
        attributes.get('srcdoc') !== ''
      ) {
        throw new TypeError(
          'Raw HTML srcdoc is not allowed in Markdown because nested resource fetches cannot be verified',
        );
      }
      if (
        tag === 'meta' &&
        String(attributes.get('http-equiv') ?? '').toLowerCase() === 'refresh'
      ) {
        throw new TypeError(
          'Meta refresh is not allowed in Markdown because its target cannot be verified as page content',
        );
      }

      for (const [name, attributeValue] of attributes) {
        if (typeof attributeValue !== 'string') continue;
        if (SRCSET_ATTRIBUTES.has(name)) {
          for (const target of parseSrcset(attributeValue)) {
            add('image', target);
          }
          continue;
        }
        if (RESOURCE_LIST_ATTRIBUTES.has(name)) {
          for (const target of attributeValue.split(/\s+/)) {
            add('asset', target);
          }
          continue;
        }
        if (SINGLE_RESOURCE_ATTRIBUTES.has(name)) {
          add(resourceKind(tag, name, attributes), attributeValue);
        }
      }
    }

    for (const child of Object.values(value)) {
      if (child !== value.attrs) visit(child);
    }
  }

  visit(parser(markdown));
  return references;
}

export function readMarkdownImageSources(markdown) {
  return readMarkdownReferences(markdown)
    .filter(({ kind }) => kind === 'image')
    .map(({ target }) => target);
}

function resourceKind(tag, attribute, attributes) {
  if (tag === 'a' && attribute === 'href') return 'link';
  if (
    ((tag === 'img' || tag === 'image') &&
      ['href', 'src', 'xlink:href'].includes(attribute)) ||
    (tag === 'input' &&
      attribute === 'src' &&
      String(attributes.get('type') ?? '').toLowerCase() === 'image') ||
    (tag === 'video' && attribute === 'poster') ||
    attribute === 'background'
  ) {
    return 'image';
  }
  return 'asset';
}

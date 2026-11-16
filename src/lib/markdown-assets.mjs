import { parser, RuleType } from 'markdown-to-jsx/markdown';

import { splitSrcset } from './site-url.mjs';

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
/** React prop names whose HTML attribute is spelled with a hyphen. */
const REACT_ATTRIBUTE_NAMES = {
  acceptcharset: 'accept-charset',
  httpequiv: 'http-equiv',
};
const SAFE_RASTER_DATA_URL =
  /^data:image\/(?:avif|bmp|gif|jpeg|png|vnd\.microsoft\.icon|webp|x-icon)(?:[;,])/i;

/**
 * The URLs of a `srcset`, split as `splitSrcset` does, failing closed on a
 * descriptor the HTML parser would reject.
 */
export function parseSrcset(value) {
  return splitSrcset(value).map(({ url, descriptor }) => {
    const descriptors = descriptor.split(/\s+/).filter(Boolean);
    if (
      descriptors.length > 1 ||
      (descriptors[0] &&
        !/^(?:\d+w|\d+h|(?:\d+(?:\.\d+)?|\.\d+)x)$/.test(descriptors[0]))
    ) {
      throw new TypeError(`Invalid srcset descriptor in: ${value}`);
    }
    return url;
  });
}

/**
 * Every URL-like resource the Markdown renderer can cause a browser to fetch.
 *
 * Reference-style Markdown has already been resolved by the parser. A generic
 * AST walk is deliberate: lists, tables, block quotes, and inline formatting
 * store descendants under different fields. Footnote text is the exception: the
 * parser keeps it as raw Markdown, which the renderer parses when it draws the
 * notes, so it is parsed here with the document's references.
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

    if (value.type === RuleType.refCollection) {
      visit(parseFootnotes(value.refs));
    } else if (value.type === RuleType.image) {
      add('image', value.target);
    } else if (value.type === RuleType.link) {
      add('link', value.target);
    } else if (
      value.type === RuleType.htmlBlock ||
      value.type === RuleType.htmlSelfClosing
    ) {
      const tag = String(value.tag ?? '').toLowerCase();
      // React writes `httpEquiv` as `http-equiv`, so a camel-cased name is
      // the HTML attribute it renders.
      const attributes = new Map(
        Object.entries(value.attrs ?? {}).map(([name, attributeValue]) => [
          REACT_ATTRIBUTE_NAMES[name.toLowerCase()] ?? name.toLowerCase(),
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

const REFERENCE_PLACEHOLDER = 'markdown-assets:reference:';

/**
 * Each footnote's text parsed as a document of its own, with the reference
 * definitions it may use. A definition points at a placeholder that is then
 * swapped for its target: the targets are already decoded, and writing them
 * back into Markdown would decode them a second time.
 *
 * The renderer reads a footnote with inline rules only, so a `~~~` line in one
 * is text and the link after it is live. The public parser has no inline mode,
 * so the text goes on one line after a word, where no block rule can begin.
 */
function parseFootnotes(refs = {}) {
  const entries = Object.entries(refs);
  const references = entries.filter(([label]) => !label.startsWith('^'));
  const definitions = references
    .map(([label], index) => `[${label}]: ${REFERENCE_PLACEHOLDER}${index}`)
    .join('\n');

  function restore(node) {
    if (Array.isArray(node)) {
      for (const item of node) restore(item);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (node.target?.startsWith?.(REFERENCE_PLACEHOLDER)) {
      const index = Number(node.target.slice(REFERENCE_PLACEHOLDER.length));
      node.target = references[index]?.[1].target ?? node.target;
    }
    for (const child of Object.values(node)) restore(child);
  }

  return entries
    .filter(([label]) => label.startsWith('^'))
    .map(([, { target }]) => {
      const inline = target.replace(/\s*\n\s*/g, ' ');
      const footnote = parser(`x ${inline}\n\n${definitions}`);
      restore(footnote);
      return footnote;
    });
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

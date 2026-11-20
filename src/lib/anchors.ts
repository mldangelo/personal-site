import {
  slugify as legacySlugify,
  type MarkdownToJSX,
  parser,
  RuleType,
} from 'markdown-to-jsx/react';

import { PAGE_IDS } from './page-ids';

export function createHeadingId(title: string): string {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'section';
}

export function createUniqueHeadingIds(
  titles: readonly string[],
  reservedIds: Iterable<string> = [],
): string[] {
  const claimed = new Set(reservedIds);
  const nextSuffix = new Map<string, number>();

  return titles.map((title) => {
    const baseId = createHeadingId(title);

    if (!claimed.has(baseId)) {
      claimed.add(baseId);
      nextSuffix.set(baseId, 2);
      return baseId;
    }

    let suffix = nextSuffix.get(baseId) ?? 2;
    let candidate = `${baseId}-${suffix}`;

    while (claimed.has(candidate)) {
      suffix += 1;
      candidate = `${baseId}-${suffix}`;
    }

    claimed.add(candidate);
    nextSuffix.set(baseId, suffix + 1);

    return candidate;
  });
}

interface MarkdownHeadingPlan {
  aliases: Map<string, string>;
  /** The id of the note a footnote label names, matched without case. */
  footnoteId: (label: string) => string | undefined;
  slugify: (source: string) => string;
}

interface ReservedMarkdownIds {
  footnoteIds: Map<string, string>;
  ids: Set<string>;
}

function collectReservedMarkdownIds(
  nodes: readonly MarkdownToJSX.ASTNode[],
  reserved: Iterable<string>,
): ReservedMarkdownIds {
  const footnoteIds = new Map<string, string>();
  const footnoteSources: string[] = [];
  const ids = new Set<string>(reserved);

  const visit = (node: MarkdownToJSX.ASTNode): void => {
    if (
      node.type === RuleType.htmlBlock ||
      node.type === RuleType.htmlSelfClosing
    ) {
      const id = node.attrs?.id;
      if (typeof id === 'string' && id) {
        ids.add(id);
      }
    }

    if (node.type === RuleType.refCollection) {
      for (const ref of Object.keys(node.refs)) {
        if (ref.startsWith('^') && ref.length > 1) {
          footnoteSources.push(ref.slice(1));
        }
      }
    }

    // Nodes nest in `children`, list `items`, and table `header` and
    // `cells`: arrays up to three deep.
    for (const value of Object.values(node)) {
      if (!Array.isArray(value)) continue;
      for (const child of value.flat(2)) {
        if (child && typeof child === 'object') {
          visit(child as MarkdownToJSX.ASTNode);
        }
      }
    }
  };

  for (const node of nodes) {
    visit(node);
  }

  // A label the slugifier empties, such as one in another script, would give
  // its note `id=""` and its marker `href="#"`, and two labels can slugify
  // alike. Each note gets its own id, after every raw id is known.
  for (const source of footnoteSources) {
    const base = legacySlugify(source) || 'note';
    let id = base;
    for (let suffix = 2; ids.has(id); suffix += 1) {
      id = `${base}-${suffix}`;
    }
    footnoteIds.set(source, id);
    ids.add(id);
  }

  return { footnoteIds, ids };
}

/**
 * Plans the unique heading ids for a Markdown document and any legacy ids that
 * still need to resolve.
 *
 * Canonical ids come from createHeadingId; published anchors from
 * markdown-to-jsx's slugifier stay resolvable as aliases. Parsing once up front
 * lets the renderer both de-duplicate its canonical ids and retain those
 * aliases safely.
 */
export function planMarkdownHeadingAnchors(
  markdown: string,
): MarkdownHeadingPlan {
  const headings: Array<{ source: string; legacy: string }> = [];

  const ast = parser(markdown, {
    slugify: (source, legacySlugify) => {
      const legacy = legacySlugify(source);

      headings.push({ source, legacy });

      return legacy;
    },
  });

  const { footnoteIds, ids: reservedIds } = collectReservedMarkdownIds(
    ast,
    PAGE_IDS,
  );
  const ids = createUniqueHeadingIds(
    headings.map(({ source }) => source),
    reservedIds,
  );
  const renderIdsBySource = new Map<string, string[]>();
  const plan = (source: string, id: string) => {
    renderIdsBySource.set(source, [
      ...(renderIdsBySource.get(source) ?? []),
      id,
    ]);
  };

  for (const [index, { source }] of headings.entries()) {
    plan(source, ids[index]);
  }

  // markdown-to-jsx calls the same slugifier for footnote footer ids after it
  // renders the headings. Appending the original footnote id keeps that call
  // paired with the href the parser already emitted, including when a heading
  // and footnote use the exact same source text.
  for (const [source, id] of footnoteIds) {
    plan(source, id);
  }

  const callsBySource = new Map<string, number>();
  const slugify = (source: string): string => {
    const sourceIds = renderIdsBySource.get(source);
    if (!sourceIds?.length) {
      // markdown-to-jsx also uses this callback for generated structures such
      // as footnote footer ids. Their links already target the library's own
      // slug scheme, so changing an unplanned value here would break the pair.
      return legacySlugify(source);
    }

    const call = callsBySource.get(source) ?? 0;
    callsBySource.set(source, call + 1);

    // React Strict Mode may evaluate markdown-to-jsx's memoized compiler more
    // than once. Cycling over each source's complete id sequence makes every
    // full evaluation deterministic instead of exhausting a one-shot cursor.
    return sourceIds[call % sourceIds.length];
  };

  const aliases = new Map<string, string>();
  const claimedIds = new Set([...reservedIds, ...ids]);

  for (const [index, { legacy }] of headings.entries()) {
    if (!legacy || claimedIds.has(legacy)) {
      continue;
    }

    aliases.set(ids[index], legacy);
    claimedIds.add(legacy);
  }

  const footnotesByLabel = new Map(
    [...footnoteIds].map(([source, id]) => [source.toLowerCase(), id]),
  );
  const footnoteId = (label: string) =>
    footnotesByLabel.get(label.toLowerCase());

  return { aliases, footnoteId, slugify };
}

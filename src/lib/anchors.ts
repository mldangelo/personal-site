import {
  slugify as legacySlugify,
  type MarkdownToJSX,
  parser,
  RuleType,
} from 'markdown-to-jsx';

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

export interface MarkdownHeadingPlan {
  ids: string[];
  aliases: Map<string, string>;
  slugify: (source: string) => string;
}

interface ReservedMarkdownIds {
  footnoteIds: Map<string, string>;
  ids: Set<string>;
}

function collectReservedMarkdownIds(
  nodes: readonly MarkdownToJSX.ASTNode[],
): ReservedMarkdownIds {
  const footnoteIds = new Map<string, string>();
  const ids = new Set<string>();

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
          const source = ref.slice(1);
          const id = legacySlugify(source);

          footnoteIds.set(source, id);
          ids.add(id);
        }
      }
    }

    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child);
      }
    }

    if ('items' in node) {
      for (const item of node.items) {
        for (const child of item) {
          visit(child);
        }
      }
    }

    if (node.type === RuleType.table) {
      for (const cell of [...node.header, ...node.cells.flat()]) {
        for (const child of cell) {
          visit(child);
        }
      }
    }
  };

  for (const node of nodes) {
    visit(node);
  }

  return { footnoteIds, ids };
}

/**
 * Plans the unique heading ids for a Markdown document and any legacy ids that
 * still need to resolve.
 *
 * Posts originally shipped with markdown-to-jsx's slugifier. The site later
 * standardized on createHeadingId, which is more readable but changed several
 * already-public anchors. Parsing once up front lets the renderer both
 * de-duplicate its canonical ids and retain safe aliases for the exact legacy
 * values the library used to publish.
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

  const { footnoteIds, ids: reservedIds } = collectReservedMarkdownIds(ast);
  const ids = createUniqueHeadingIds(
    headings.map(({ source }) => source),
    reservedIds,
  );
  const renderIdsBySource = new Map<string, string[]>();

  for (const [index, { source }] of headings.entries()) {
    const id = ids[index];
    if (id) {
      renderIdsBySource.set(source, [
        ...(renderIdsBySource.get(source) ?? []),
        id,
      ]);
    }
  }

  // markdown-to-jsx calls the same slugifier for footnote footer ids after it
  // renders the headings. Appending the original footnote id keeps that call
  // paired with the href the parser already emitted, including when a heading
  // and footnote use the exact same source text.
  for (const [source, id] of footnoteIds) {
    renderIdsBySource.set(source, [
      ...(renderIdsBySource.get(source) ?? []),
      id,
    ]);
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
    return sourceIds[call % sourceIds.length] ?? legacySlugify(source);
  };

  const canonicalIds = new Set(ids);
  const aliases = new Map<string, string>();
  const claimedIds = new Set([...reservedIds, ...canonicalIds]);

  for (const [index, { legacy }] of headings.entries()) {
    const canonical = ids[index];

    if (!canonical || !legacy || claimedIds.has(legacy)) {
      continue;
    }

    aliases.set(canonical, legacy);
    claimedIds.add(legacy);
  }

  return { ids, aliases, slugify };
}

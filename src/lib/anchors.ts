import { parser } from 'markdown-to-jsx';

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

export function createUniqueHeadingIds(titles: readonly string[]): string[] {
  const seen = new Map<string, number>();

  return titles.map((title) => {
    const baseId = createHeadingId(title);
    const count = (seen.get(baseId) ?? 0) + 1;

    seen.set(baseId, count);

    return count === 1 ? baseId : `${baseId}-${count}`;
  });
}

export interface MarkdownHeadingPlan {
  ids: string[];
  aliases: Map<string, string>;
  slugify: (source: string) => string;
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

  parser(markdown, {
    slugify: (source, legacySlugify) => {
      const legacy = legacySlugify(source);

      headings.push({ source, legacy });

      return legacy;
    },
  });

  const ids = createUniqueHeadingIds(headings.map(({ source }) => source));
  const idsBySource = new Map<string, string[]>();

  for (const [index, { source }] of headings.entries()) {
    const id = ids[index];
    if (id) {
      idsBySource.set(source, [...(idsBySource.get(source) ?? []), id]);
    }
  }

  const callsBySource = new Map<string, number>();
  const slugify = (source: string): string => {
    const sourceIds = idsBySource.get(source);
    if (!sourceIds?.length) {
      return createHeadingId(source);
    }

    const call = callsBySource.get(source) ?? 0;
    callsBySource.set(source, call + 1);

    // React Strict Mode may evaluate markdown-to-jsx's memoized compiler more
    // than once. Cycling over each source's complete id sequence makes every
    // full evaluation deterministic instead of exhausting a one-shot cursor.
    return sourceIds[call % sourceIds.length] ?? createHeadingId(source);
  };

  const canonicalIds = new Set(ids);
  const legacyCounts = new Map<string, number>();

  for (const { legacy } of headings) {
    if (legacy) {
      legacyCounts.set(legacy, (legacyCounts.get(legacy) ?? 0) + 1);
    }
  }

  const aliases = new Map<string, string>();
  const claimedIds = new Set(canonicalIds);

  for (const [index, { legacy }] of headings.entries()) {
    const canonical = ids[index];

    if (
      !canonical ||
      !legacy ||
      claimedIds.has(legacy) ||
      legacyCounts.get(legacy) !== 1
    ) {
      continue;
    }

    aliases.set(canonical, legacy);
    claimedIds.add(legacy);
  }

  return { ids, aliases, slugify };
}

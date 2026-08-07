import type { StatRow } from '@/components/ui/table';
import initialData from '@/data/stats/site';
import { SOURCE_REPO as REPO_URL } from '@/lib/site';
import { countSourceLines } from '@/lib/source-size';

const REPO_API = 'https://api.github.com/repos/adase11/personal-site';

/**
 * Merges live GitHub repo numbers onto the static row definitions. Runs on the
 * server and is revalidated hourly, so the figures are in the HTML rather than
 * fetched by the client.
 *
 * Any failure — network, rate limit, unexpected shape — falls back to the
 * static rows. A flaky third-party API must not fail the build or the page.
 */
export const getSiteStats = async (): Promise<StatRow[]> => {
  const [repo, sourceLines] = await Promise.all([
    fetchRepo(),
    countSourceLines()
  ]);

  const rows = repo
    ? initialData.map((row) =>
        row.key && Object.hasOwn(repo, row.key)
          ? { ...row, value: String(repo[row.key]) }
          : row
      )
    : initialData;

  return [
    ...rows,
    {
      label: 'Lines of source powering this website',
      value: sourceLines.toLocaleString('en-US'),
      link: `${REPO_URL}/graphs/contributors`
    }
  ];
};

const fetchRepo = async (): Promise<Record<string, unknown> | null> => {
  try {
    const res = await fetch(REPO_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 }
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

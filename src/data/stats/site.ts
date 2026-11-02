import type { StatDeclaration } from '@/lib/readings';
import { SOURCE_REPOSITORY } from '@/lib/telemetry';

const REPOSITORY = `https://github.com/${SOURCE_REPOSITORY}`;

/**
 * Readings about this site, filled by `src/components/Stats/Site.tsx`.
 *
 * The GitHub counts describe the source repository and the line count is
 * taken from this build's checkout. The page used to carry more — dependency
 * and lockfile counts, lint rules, open issues, the build's commit and date —
 * that were exact but told a reader nothing worth knowing. A row belongs here
 * when someone would be interested in the number, not because it can be
 * counted.
 */
const data: StatDeclaration[] = [
  {
    label: 'GitHub stars',
    key: 'stargazers_count',
    link: `${REPOSITORY}/stargazers`,
  },
  {
    label: 'Watchers',
    key: 'subscribers_count',
    link: `${REPOSITORY}/watchers`,
  },
  {
    label: 'Forks',
    key: 'forks',
    link: `${REPOSITORY}/network`,
  },
  {
    // Non-test TypeScript under app/ and src/: see `countSourceLines`.
    label: 'Lines of TypeScript powering this site',
    key: 'source_lines',
    link: REPOSITORY,
  },
  {
    label: 'Number of spoons',
    value: 0,
  },
];

export default data;

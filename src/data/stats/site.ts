import dayjs from 'dayjs';

import type { StatDeclaration } from '@/lib/readings';

const REPO = 'https://github.com/mldangelo/personal-site';
const BLOB = `${REPO}/blob/main`;

/* Keys are filled in by `src/components/Stats/Site.tsx`: `source: 'github'`
 * rows match keys returned by the GitHub api, `source: 'measured'` rows are
 * counted from the working tree at build time. To see everything returned by
 * the github api, run:
 curl https://api.github.com/repos/mldangelo/personal-site
 *
 * Never type a figure about this codebase into this file. A `measured` row
 * declares a `key` and no `value`; `src/data/__tests__/stats/site.test.ts`
 * enforces that. The rule exists because two rows here broke it — the lines
 * count drifted by nearly 2,000 lines, and `Number of linter warnings: '0'`
 * carried the comment "enforced via github workflow" four lines below the
 * warning against exactly that.
 */
const data: StatDeclaration[] = [
  {
    label: 'Stars this repository has on github',
    key: 'stargazers_count',
    source: 'github',
    link: `${REPO}/stargazers`,
  },
  {
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    source: 'github',
    link: `${REPO}/watchers`,
  },
  {
    label: 'Number of forks',
    key: 'forks',
    source: 'github',
    link: `${REPO}/network`,
  },
  {
    // GitHub's open_issues_count includes open pull requests, so the label
    // says what the number actually counts rather than overstating issues.
    label: 'Open github issues and pull requests',
    key: 'open_issues_count',
    source: 'github',
    link: 'https://github.com/search?q=repo%3Amldangelo%2Fpersonal-site+is%3Aopen&type=issues',
  },
  {
    label: 'Last updated at',
    key: 'pushed_at',
    source: 'github',
    link: `${REPO}/commits`,
    format: (x: unknown) => dayjs(x as string).format('MMMM DD, YYYY'),
  },
  {
    // Counted by `countSourceLines()`; see `src/lib/loc.ts`. No `unit` — the
    // label already names it, and a unit that repeats the label is noise.
    label: 'Lines of TypeScript powering this website',
    key: 'source_lines',
    source: 'measured',
    link: `${REPO}/graphs/contributors`,
  },
  {
    // The next four are the hardest evidence for "fast by default" and "easy
    // to fork" in docs/design-goals.md, and they are the numbers a forker
    // actually wants: what the project chose, what that resolves to, and how
    // much of it a production install carries.
    label: 'Dependencies declared directly',
    key: 'direct_dependencies',
    source: 'measured',
    unit: 'packages',
    link: `${BLOB}/package.json`,
  },
  {
    label: 'Installed to run in production',
    key: 'production_packages',
    source: 'measured',
    unit: 'packages',
    link: `${BLOB}/package-lock.json`,
  },
  {
    label: 'Resolved into the lockfile',
    key: 'locked_packages',
    source: 'measured',
    unit: 'packages',
    link: `${BLOB}/package-lock.json`,
  },
  {
    // Replaces `Number of linter warnings: '0'`. How many rules are turned on
    // is checkable from the working tree; zero warnings is a property of a CI
    // run, which is not something this page can observe.
    label: 'Enforced by CI on every push',
    key: 'lint_rules',
    source: 'measured',
    unit: 'lint rules',
    link: `${BLOB}/biome.json`,
  },
  {
    // The joke, and the only row on the page that measures nothing — so it is
    // the only row with no provenance mark. Last, because it reads better as a
    // punchline than as an interruption.
    label: 'Number of spoons',
    value: 0,
  },
];

export default data;

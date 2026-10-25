import type { StatDeclaration } from '@/lib/readings';
import {
  buildSourceFileUrl,
  buildSourceTreeUrl,
  builtCommitUrl,
  DEFAULT_SOURCE_REPOSITORY,
  SHORT_SHA_LENGTH,
  utcDate,
} from '@/lib/telemetry';

const REPOSITORY = `https://github.com/${DEFAULT_SOURCE_REPOSITORY}`;

const OPEN_ITEMS_SEARCH = `https://github.com/search?${new URLSearchParams({
  q: `repo:${DEFAULT_SOURCE_REPOSITORY} is:open`,
  type: 'issues',
})}`;

/**
 * Keys are filled by `src/components/Stats/Site.tsx`. GitHub rows describe the
 * public upstream repository; measured rows describe this exact build and link
 * to its repository and immutable revision when CI provides that identity.
 *
 * A label says only what its surroundings have not. The page sets each
 * `source` in a table of its own under a caption naming it, inside a section
 * headed "This site", so a row no longer spells out "this repository" or "on
 * GitHub" for itself: written as sentences, the labels ran to three lines on
 * a phone. Shortening stops where it would change the claim. The two counts
 * of package locations keep every qualifying word: one package can be
 * installed at several locations, and only one of the counts leaves
 * development tooling out.
 */
const data: StatDeclaration[] = [
  {
    label: 'GitHub stars',
    key: 'stargazers_count',
    source: 'github',
    link: `${REPOSITORY}/stargazers`,
  },
  {
    label: 'Watchers',
    key: 'subscribers_count',
    source: 'github',
    link: `${REPOSITORY}/watchers`,
  },
  {
    label: 'Forks',
    key: 'forks',
    source: 'github',
    link: `${REPOSITORY}/network`,
  },
  {
    // GitHub's open_issues_count includes open pull requests.
    label: 'Open issues and pull requests',
    key: 'open_issues_count',
    source: 'github',
    link: OPEN_ITEMS_SEARCH,
  },
  {
    // `pushed_at` is repository activity, not deployment provenance.
    label: 'Latest repository push (UTC)',
    key: 'pushed_at',
    source: 'github',
    link: `${REPOSITORY}/activity`,
    format: (value: unknown) => utcDate(new Date(String(value)).getTime()),
  },
  {
    label: 'Built from commit',
    key: 'built_commit',
    source: 'measured',
    format: (value: unknown) => String(value).slice(0, SHORT_SHA_LENGTH),
    link: builtCommitUrl,
  },
  {
    label: 'Built on (UTC)',
    key: 'built_at',
    source: 'measured',
  },
  {
    label: 'Lines of TypeScript powering this site',
    key: 'source_lines',
    source: 'measured',
    link: buildSourceTreeUrl,
  },
  {
    label: 'Direct dependencies',
    key: 'direct_dependencies',
    source: 'measured',
    unit: 'packages',
    link: () => buildSourceFileUrl('package.json'),
  },
  {
    label: 'Installed non-development package locations',
    key: 'installed_non_dev_packages',
    source: 'measured',
  },
  {
    label: 'Lockfile package locations',
    key: 'locked_packages',
    source: 'measured',
    link: () => buildSourceFileUrl('package-lock.json'),
  },
  {
    label: 'Biome lint rules enabled in CI',
    key: 'lint_rules',
    source: 'measured',
    link: () => buildSourceFileUrl('biome.json'),
  },
  {
    // The only row that measures nothing, so it declares no source and the
    // page sets it apart from the tables that do.
    label: 'Number of spoons',
    value: 0,
  },
];

export default data;

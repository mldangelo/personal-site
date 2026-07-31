import type { StatDeclaration } from '@/lib/readings';
import {
  buildRepositoryUrl,
  buildSourceFileUrl,
  builtCommitUrl,
  SHORT_SHA_LENGTH,
  utcDate,
} from '@/lib/telemetry';

const REPOSITORY = 'https://github.com/mldangelo/personal-site';

/**
 * Keys are filled by `src/components/Stats/Site.tsx`. GitHub rows describe the
 * public upstream repository; measured rows describe this exact build and link
 * to its repository and immutable revision when CI provides that identity.
 */
const data: StatDeclaration[] = [
  {
    label: 'Stars this repository has on GitHub',
    key: 'stargazers_count',
    source: 'github',
    link: `${REPOSITORY}/stargazers`,
  },
  {
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    source: 'github',
    link: `${REPOSITORY}/watchers`,
  },
  {
    label: 'Number of forks',
    key: 'forks',
    source: 'github',
    link: `${REPOSITORY}/network`,
  },
  {
    // GitHub's open_issues_count includes open pull requests.
    label: 'Open GitHub issues and pull requests',
    key: 'open_issues_count',
    source: 'github',
    link: 'https://github.com/search?q=repo%3Amldangelo%2Fpersonal-site+is%3Aopen&type=issues',
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
    label: 'Lines of TypeScript powering this website',
    key: 'source_lines',
    source: 'measured',
    link: () => buildRepositoryUrl('/graphs/contributors'),
  },
  {
    label: 'Dependencies declared directly',
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
    // The only row that measures nothing, so it has no provenance mark.
    label: 'Number of spoons',
    value: 0,
  },
];

export default data;

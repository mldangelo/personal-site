import dayjs from 'dayjs';
import type { StatRow } from '@/components/ui/table';

const REPO = 'https://github.com/adase11/personal-site';

/* Keys match keys returned by the github api. Fields without keys are
 * mostly jokes. To see everything returned by the github api, run:
 curl https://api.github.com/repos/adase11/personal-site
 */
const initialData: StatRow[] = [
  {
    label: 'Stars this repository has on github',
    key: 'stargazers_count',
    link: `${REPO}/stargazers`
  },
  {
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    link: `${REPO}/watchers`
  },
  {
    label: 'Number of forks',
    key: 'forks',
    link: `${REPO}/network`
  },
  {
    label: 'Number of linter warnings',
    value: '0' // enforced via github workflow
  },
  {
    label: 'Open github issues',
    key: 'open_issues_count',
    link: `${REPO}/issues`
  },
  {
    label: 'Last updated at',
    key: 'pushed_at',
    link: `${REPO}/commits`,
    format: (value) => dayjs(String(value)).format('MMMM DD, YYYY')
  }
];

export default initialData;

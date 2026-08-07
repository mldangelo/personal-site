import dayjs from 'dayjs';
import type { ITableData } from '../../components/Stats/Table';

export interface IGitHubData extends ITableData {}

/* Keys match keys returned by the github api. Fields without keys are
 * mostly jokes. To see everything returned by the github api, run:
 curl https://api.github.com/repos/adase11/personal-site
 */
const initialData: IGitHubData[] = [
  {
    label: 'Stars this repository has on github',
    key: 'stargazers_count',
    link: 'https://github.com/adase11/personal-site/stargazers'
  },
  {
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    link: 'https://github.com/adase11/personal-site/stargazers'
  },
  {
    label: 'Number of forks',
    key: 'forks',
    link: 'https://github.com/adase11/personal-site/network'
  },
  {
    label: 'Number of linter warnings',
    value: '0' // enforced via github workflow
  },
  {
    label: 'Open github issues',
    key: 'open_issues_count',
    link: 'https://github.com/adase11/personal-site/issues'
  },
  {
    label: 'Last updated at',
    key: 'pushed_at',
    link: 'https://github.com/adase11/personal-site/commits',
    format: (x: any) => dayjs(x).format('MMMM DD, YYYY')
  },
  {
    // TODO update this with a pre-commit hook
    /* find . | grep ".js" | grep -vE ".min.js|node_modules|.git|.json" |
    xargs -I file cat file | wc -l */
    label: 'Lines of Javascript powering this website',
    value: '2150',
    link: 'https://github.com/adase11/personal-site/graphs/contributors'
  }
];

export default initialData;

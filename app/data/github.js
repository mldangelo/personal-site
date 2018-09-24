import dayjs from 'dayjs';

/* Keys returned by the github api. The other keys in the array below
 * are mostly jokes. These are the keys the github api query searches for.
 */
export const githubKeys = [
  'stargazers_count',
  'watchers_count',
  'forks',
  'open_issues_count',
  'subscribers_count',
  'pushed_at',
];

// TODO To be provided by an API
const data = [
  {
    label: 'Stars this repository has on github',
    key: 'stargazers_count',
    value: '0',
    link: 'https://github.com/mldangelo/personal-site/stargazers',
  }, {
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    value: '1',
    link: 'https://github.com/mldangelo/personal-site/stargazers',
  }, {
    label: 'Number of forks',
    key: 'forks',
    value: '0',
    link: 'https://github.com/mldangelo/personal-site/network',
  }, {
    label: 'Number of spoons',
    value: '0',
  }, {
    label: 'Number of linter warnings',
    // TODO ammend this with a pre-commit hook
    // `npm run lint | grep problems | tail -1 | awk '{print $2}'`
    value: '0',
  }, {
    label: 'Open github issues',
    key: 'open_issues_count',
    value: '0',
    link: 'https://github.com/mldangelo/personal-site/issues',
  }, {
    label: 'Last updated at',
    key: 'pushed_at',
    value: dayjs().format('MMMM D, YYYY'),
    link: 'https://github.com/mldangelo/personal-site/commits',
  },
  { /* find . | grep ".js" | grep -vE ".min.js|node_modules|.git|.json" |
    xargs -I file cat file | wc -l */
    label: 'Lines of Javascript powering this website',
    value: '2625',
    link: 'https://github.com/mldangelo/personal-site/graphs/contributors',
  },
];

export default data;

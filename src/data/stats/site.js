import moment from 'moment';

/* Keys match keys returned by the github api. Fields without keys are
 * mostly jokes. To see everything returned by the github api, run:
 curl https://api.github.com/repos/mldangelo/personal-site
 */
const data = [
  {
    label: 'Stars this repository has on github',
    key: 'stargazers_count',
    value: '0',
    link: 'https://github.com/mldangelo/personal-site/stargazers',
  },
  {
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    value: '1',
    link: 'https://github.com/mldangelo/personal-site/stargazers',
  },
  {
    label: 'Number of forks',
    key: 'forks',
    value: '0',
    link: 'https://github.com/mldangelo/personal-site/network',
  },
  {
    label: 'Number of spoons',
    value: '0',
  },
  {
    label: 'Number of linter warnings',
    // TODO amend this with a pre-commit hook
    // `npm run lint | grep problems | tail -1 | awk '{print $2}'`
    value: '0',
  },
  {
    label: 'Open github issues',
    key: 'open_issues_count',
    value: '0',
    link: 'https://github.com/mldangelo/personal-site/issues',
  },
  {
    label: 'Last updated at',
    key: 'pushed_at',
    value: moment(),
    link: 'https://github.com/mldangelo/personal-site/commits',
    format: (x) => moment(x).format('MMMM D, YYYY'),
  },
  {
    /* find . | grep ".js" | grep -vE ".min.js|node_modules|.git|.json" |
    xargs -I file cat file | wc -l */
    label: 'Lines of Javascript powering this website',
    value: '2625',
    link: 'https://github.com/mldangelo/personal-site/graphs/contributors',
  },
];

export default data;

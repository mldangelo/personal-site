import moment from 'moment';

// TODO To be provided by an API
const data = [
  {
    label: 'Stars this repository has on github',
    key: 'stargazers_count',
    value: '0',
    link: 'https://github.com/mldangelo/mldangelo/stargazers',
  }, {
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    value: '1',
    link: 'https://github.com/mldangelo/mldangelo/stargazers',
  }, {
    label: 'Number of forks',
    key: 'forks',
    value: '0',
    link: 'https://github.com/mldangelo/mldangelo/network',
  }, {
    label: 'Number of spoons',
    value: '0',
  }, {
    label: 'Number of linter warnings',
    value: '6', // TODO Update from travis / circle
  }, {
    label: 'Open github issues',
    key: 'open_issues_count',
    value: '0',
    link: 'https://github.com/mldangelo/mldangelo/issues'
  }, {
    label: 'Last updated at',
    key: 'pushed_at',
    value: moment().format('MMMM Do YYYY'),
    link: 'https://github.com/mldangelo/mldangelo/commits',
  }
];

/* // TODO Add these fields later
{
 label: 'number of lines of code powering this website',
 value: '9762',
 link: 'https://github.com/mldangelo/mldangelo/graphs/contributors',
},
{
 label: 'languages used',
 value: '6',
}, {
 label: 'number of contributors',
 value: '1',
 link: 'https://github.com/mldangelo/mldangelo/graphs/contributors',
},
*/

export default data;

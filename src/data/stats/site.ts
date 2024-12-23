import dayjs from 'dayjs';

interface StatItem {
  label: string;
  key: string;
  value?: string | number;
  link?: string;
  format?: (value: string | number) => string;
}

const stats: StatItem[] = [
  {
    label: 'Stars this repository has on github',
    value: 0,
    key: 'stargazers_count',
    link: 'https://github.com/mldangelo/personal-site/stargazers',
  },
  {
    label: 'Number of people watching this repository',
    value: 1,
    key: 'subscribers_count',
    link: 'https://github.com/mldangelo/personal-site/watchers',
  },
  {
    label: 'Number of forks',
    value: 0,
    key: 'forks',
    link: 'https://github.com/mldangelo/personal-site/network',
  },
  {
    label: 'Number of spoons',
    value: 0,
    key: 'spoons',
    link: 'https://github.com/mldangelo/personal-site/network',
  },
  {
    label: 'Open github issues',
    value: 0,
    key: 'open_issues_count',
    link: 'https://github.com/mldangelo/personal-site/issues',
  },
  {
    label: 'Last updated at',
    key: 'pushed_at',
    link: 'https://github.com/mldangelo/personal-site/commits',
    format: (value: string) => {
      const date = new Date(value);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    },
  },
  {
    label: 'Lines of Javascript powering this website',
    value: 0,
    key: 'loc',
  },
] as const;

export type StatKey = (typeof stats)[number]['key'];
export type { StatItem };
export default stats;

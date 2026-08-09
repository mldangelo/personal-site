import dayjs from 'dayjs';
import type { StatRow } from '@/components/ui/table';
import { SOURCE_REPO } from '@/lib/site';

const PROFILE = 'https://github.com/adase11';

/* Keys match the flattened shape returned by getGithubActivity() in
 * lib/github.ts, which comes from the GitHub GraphQL API. That API has no
 * unauthenticated access, so without a GITHUB_TOKEN env var (or on any fetch
 * failure) every row here falls back to its static '—'. */
const initialData: StatRow[] = [
  {
    label: 'Contributions in the last year',
    key: 'totalContributions',
    link: PROFILE
  },
  {
    label: 'Commits in the last year',
    key: 'totalCommitContributions',
    link: `${SOURCE_REPO}/commits`
  },
  {
    label: 'Pull requests opened in the last year',
    key: 'totalPullRequestContributions',
    link: `${PROFILE}?tab=overview`
  },
  {
    label: 'Public repositories',
    key: 'publicRepos',
    link: `${PROFILE}?tab=repositories`
  },
  {
    label: 'Followers',
    key: 'followers',
    link: `${PROFILE}?tab=followers`
  },
  {
    label: 'GitHub member since',
    key: 'createdAt',
    link: PROFILE,
    format: (value) => dayjs(String(value)).format('MMMM DD, YYYY')
  }
];

export default initialData;

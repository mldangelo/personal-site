'use client';

import { useEffect, useState } from 'react';

import initialData from '../../data/stats/site';
import Table from './Table';
import type { StatData } from './types';

// GitHub API response fields used by this component
interface GitHubRepoData {
  stargazers_count: number;
  subscribers_count: number;
  forks: number;
  open_issues_count: number;
  pushed_at: string;
}

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export default function SiteStats() {
  const [data, setData] = useState<StatData[]>(initialData);
  const [status, setStatus] = useState<FetchStatus>('idle');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGitHubData() {
      setStatus('loading');

      try {
        const res = await fetch(
          'https://api.github.com/repos/mldangelo/personal-site',
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error(`GitHub API returned ${res.status}`);
        }

        const resData: GitHubRepoData = await res.json();

        setData(
          initialData.map((field) => ({
            ...field,
            value:
              field.key && field.key in resData
                ? (resData[field.key as keyof GitHubRepoData] ?? field.value)
                : field.value,
          })),
        );
        setStatus('success');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore abort errors
        }
        console.error('Failed to fetch GitHub data:', error);
        setStatus('error');
      }
    }

    fetchGitHubData();

    return () => controller.abort();
  }, []);

  if (status === 'error') {
    return (
      <div className="stats-error">
        <p>Unable to load GitHub stats. Showing cached data.</p>
        <Table data={initialData} />
      </div>
    );
  }

  return <Table data={data} />;
}

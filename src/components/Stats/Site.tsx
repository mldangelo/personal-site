'use client';

import React, { useEffect, useState } from 'react';

import initialData from '../../data/stats/site';
import Table from './Table';
import { StatData } from './types';

// GitHub API response fields used by this component
interface GitHubRepoData {
  stargazers_count: number;
  subscribers_count: number;
  forks: number;
  open_issues_count: number;
  pushed_at: string;
}

const Stats: React.FC = () => {
  const [data, setResponseData] = useState<StatData[]>(initialData);

  // React 19: Simplified data fetching without unnecessary useCallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/repos/mldangelo/personal-site',
        );
        const resData: GitHubRepoData = await res.json();

        setResponseData(
          initialData.map((field) => ({
            ...field,
            // Update value if key exists in GitHub response
            value:
              field.key && field.key in resData
                ? (resData[field.key as keyof GitHubRepoData] ?? field.value)
                : field.value,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      }
    };

    fetchData();
  }, []);

  return <Table data={data} />;
};

export default Stats;

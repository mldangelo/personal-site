'use client';

import React, { useCallback, useEffect, useState } from 'react';

import initialData from '../../data/stats/site';
import Table from './Table';
import { StatData } from './types';

interface GitHubRepoData {
  [key: string]: string | number | boolean | null;
}

const Stats: React.FC = () => {
  const [data, setResponseData] = useState<StatData[]>(initialData);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('https://api.github.com/repos/mldangelo/personal-site');
      const resData: GitHubRepoData = await res.json();

      setResponseData(
        initialData.map((field) => ({
          ...field,
          // update value if value was returned by call to github
          value:
            field.key && Object.keys(resData).includes(field.key)
              ? (resData[field.key] ?? field.value)
              : field.value,
        })),
      );
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h3>Some stats about this site</h3>
      <Table data={data} />
    </div>
  );
};

export default Stats;

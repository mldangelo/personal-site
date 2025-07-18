'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { AsyncContent } from '@/components/common/AsyncContent';
import { Skeleton } from '@/components/common/Skeleton';

import initialData from '../../data/stats/site';
import Table from './Table';
import { StatData } from './types';

interface GitHubRepoData {
  [key: string]: string | number | boolean | null;
}

const Stats: React.FC = () => {
  const [data, setResponseData] = useState<StatData[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const LoadingSkeleton = (
    <div className="overflow-hidden rounded-xl glass glass-border glass-shadow">
      <div className="space-y-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex justify-between p-3 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="w-4 h-4" variant="circular" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-heading font-heading-bold uppercase tracking-heading mb-4">
        Some stats about this site
      </h3>
      <AsyncContent loading={isLoading} skeleton={LoadingSkeleton}>
        <Table data={data} />
      </AsyncContent>
    </div>
  );
};

export default Stats;

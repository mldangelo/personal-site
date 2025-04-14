'use client';

import React, { useState, useCallback, useEffect } from 'react';

import initialData from '../../data/stats/site';
import Table from './Table';

const Site = () => {
  const [data, setResponseData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO think about persisting this somewhere
  const fetchData = useCallback(async () => {
    // Don't run on server side
    if (typeof window === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      // request must be authenticated if private
      const res = await fetch(
        'https://api.github.com/repos/mldangelo/personal-site',
        { cache: 'no-store' } // Always fetch fresh data
      );

      if (!res.ok) {
        throw new Error(`GitHub API returned ${res.status}: ${res.statusText}`);
      }

      const resData = await res.json();
      setResponseData(
        initialData.map((field) => ({
          ...field,
          // update value if value was returned by call to github
          value: Object.keys(resData).includes(field.key) ? resData[field.key] : field.value,
        }))
      );
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      setError('Failed to fetch data from GitHub');
      // Keep using initial data in case of error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h3>
        Some stats about this site
        {loading && ' (loading...)'}
        {error && ` (${error})`}
      </h3>
      <Table data={data} />
    </div>
  );
};

export default Site;

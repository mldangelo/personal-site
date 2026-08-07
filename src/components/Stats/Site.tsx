import { useCallback, useEffect, useState } from 'react';
import initialData from '../../data/stats/site';
import Table from './Table';

const Stats = () => {
  const [data, setResponseData] = useState(initialData);
  // TODO think about persisting this somewhere
  const fetchData = useCallback(async () => {
    // request must be authenticated if private
    const res = await fetch(
      'https://api.github.com/repos/adase11/personal-site'
    );
    const resData = await res.json();
    setResponseData(
      initialData.map((field) => ({
        ...field,
        // update value if value was returned by call to github
        value:
          field.key && Object.hasOwn(resData, field.key)
            ? resData[field.key]
            : field.value
      }))
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="rounded-xl border border-border p-5">
      <h2 className="mb-3 font-mono text-xs tracking-widest text-accent uppercase">
        This site
      </h2>
      <Table data={data} />
    </section>
  );
};

export default Stats;

import React, { Fragment, useState, useEffect } from 'react';

import axios from 'axios';

import Table from './Table';
import initialData from '../../data/github';

const Stats = () => {
  const [data, setData] = useState(initialData);

  const fetchData = async () => {
    const result = await axios('/api/github');
    setData(initialData.map((field) => {
      const value = field.key ? { value: String(result.data[field.key]) } : {};
      return Object.assign(field, value);
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h3>Some stats about this site</h3>
      <Table data={data} />
    </>
  );
};

export default Stats;

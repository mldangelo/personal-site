'use client';

import React, { useState, useEffect } from 'react';

const Age = () => {
  const [age, setAge] = useState('');
  const [mounted, setMounted] = useState(false);

  const tick = () => {
    // Make sure we're in a browser environment
    if (typeof window === 'undefined') return;

    const divisor = 1000 * 60 * 60 * 24 * 365.2421897; // ms in an average year
    const birthTime = new Date('1990-02-05T09:24:00');
    setAge(((Date.now() - birthTime) / divisor).toFixed(11));
  };

  useEffect(() => {
    // Don't run on server side
    if (typeof window === 'undefined') return;

    setMounted(true);
    const timer = setInterval(() => tick(), 25);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!mounted) return <>Loading...</>;
  return <>{age}</>;
};

const data = [
  {
    key: 'age',
    label: 'Current age',
    value: <Age />,
  },
  {
    key: 'countries',
    label: 'Countries visited',
    value: 53,
    link: 'https://www.google.com/maps/d/embed?mid=1iBBTscqateQ93pWFVfHCUZXoDu8&z=2',
  },
  {
    key: 'location',
    label: 'Current city',
    value: 'New York, NY',
  },
];

export default data;

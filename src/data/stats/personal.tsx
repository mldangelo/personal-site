'use client';

import React, { useEffect, useState } from 'react';

import { StatData } from '../../components/Stats/types';

const Age: React.FC = () => {
  const [age, setAge] = useState<string>('');

  const tick = () => {
    const divisor = 1000 * 60 * 60 * 24 * 365.2421897; // ms in an average year
    const birthTime = new Date('1990-02-05T09:24:00');
    setAge(((Date.now() - birthTime.getTime()) / divisor).toFixed(11));
  };

  useEffect(() => {
    tick(); // Initial tick
    const timer = setInterval(() => tick(), 25);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>{age}</>;
};

const data: StatData[] = [
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

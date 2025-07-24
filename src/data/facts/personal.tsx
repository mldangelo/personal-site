'use client';

import React, { useEffect, useState } from 'react';

import { StatData } from '../../components/Facts/types';

interface AgeProps {
  time: Date;
}

const Age: React.FC<AgeProps> = ({ time }) => {
  const [age, setAge] = useState<string>('');

  const tick = () => {
    const divisor = 1000 * 60 * 60 * 24 * 365.2421897; // ms in an average year
    setAge(((Date.now() - time.getTime()) / divisor).toFixed(11));
  };

  useEffect(() => {
    tick();
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
    value: <Age time={new Date('1999-06-22T18:30:00')} />,
  },
  {
    key: 'phdage',
    label: 'Current PhD age',
    value: <Age time={new Date('2025-01-05T09:00:00')} />,
  },
  {
    key: 'mentalage',
    label: 'Current mental age',
    value: 'Classified',
  },
  {
    key: 'location',
    label: 'Current city',
    value: 'Z\u00fcrich, Switzerland',
  },
  {
    key: 'hometown',
    label: 'Hometown',
    value: 'Hangzhou, China',
  },
];

export default data;

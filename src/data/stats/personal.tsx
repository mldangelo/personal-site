'use client';

import { useEffect, useState } from 'react';

import type { StatData } from '../../components/Stats/types';

/** Birth date for age calculation (ISO format) */
const BIRTH_DATE = '1990-02-05T09:24:00';

/** Milliseconds in an average year (accounting for leap years) */
const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.2421897;

/** Update interval for age display in ms */
const AGE_UPDATE_INTERVAL = 25;

/** Number of decimal places for age display */
const AGE_PRECISION = 11;

function Age() {
  const [age, setAge] = useState<string>('');

  const tick = () => {
    const birthTime = new Date(BIRTH_DATE);
    setAge(
      ((Date.now() - birthTime.getTime()) / MS_PER_YEAR).toFixed(AGE_PRECISION),
    );
  };

  useEffect(() => {
    tick(); // Initial tick
    const timer = setInterval(() => tick(), AGE_UPDATE_INTERVAL);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>{age}</>;
}

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

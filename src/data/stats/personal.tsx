'use client';

import { useEffect, useState } from 'react';

import type { StatData } from '../../components/Stats/types';

/** Birth date for age calculation (ISO format). Update in src/data/stats/personal.tsx. */
const BIRTH_DATE = '2003-12-04T12:00:00';

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
    value: 5,
  },
  {
    key: 'location',
    label: 'Current city',
    value: 'Helsinki',
  },
];

export default data;

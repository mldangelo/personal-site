import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const Age = () => {
  const [age, setAge] = useState();

  const bithDateTime = dayjs('1990-02-05T09:24:00');
  // Years vary in length. Divisor for percentage of current year.
  const msCurrentYear = dayjs().endOf('year') - dayjs().startOf('year');
  const birthYear = bithDateTime.year();

  const tick = () => {
    const currentYear = dayjs().year();
    const msSoFar = dayjs() - bithDateTime.year(currentYear);
    const currentAge = (currentYear - birthYear) + msSoFar / msCurrentYear;
    setAge(currentAge.toFixed(11));
  };

  useEffect(() => {
    const timer = setInterval(() => tick(), 25);
    return () => {
      clearInterval(timer);
    };
  }, []);
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
    link:
      'https://www.google.com/maps/d/embed?mid=1iBBTscqateQ93pWFVfHCUZXoDu8&z=2',
  },
  {
    key: 'location',
    label: 'Current city',
    value: 'New York, NY',
  },
];

export default data;

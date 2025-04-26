import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Age = ({ birthTime }) => {
  const [age, setAge] = useState();

  const tick = () => {
    const divisor = 1000 * 60 * 60 * 24 * 365.2421897; // ms in an average year
    // const birthTime = new Date('1999-06-22T18:30:00');
    setAge(((Date.now() - birthTime) / divisor).toFixed(11));
  };

  useEffect(() => {
    const timer = setInterval(() => tick(), 25);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <>{age}</>;
};

Age.propTypes = {
  birthTime: PropTypes.instanceOf(Date).isRequired,
};

const data = [
  {
    key: 'age',
    label: 'Current age',
    value: <Age birthTime={new Date('1999-06-22T18:30:00')} />,
  },
  {
    key: 'phdage',
    label: 'Current PhD age',
    value: <Age birthTime={new Date('2025-01-05T09:00:00')} />,
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

import React, { useEffect, useState } from 'react';

const Age = () => {
  const [age, setAge] = useState<string>();

  const tick = () => {
    const divisor = 1000 * 60 * 60 * 24 * 365.2421897; // ms in an average year
    const birthTime = new Date('1993-03-25T00:00:00');

    // Directly compute the age and set it
    const ageString = ((Date.now() - birthTime.getTime()) / divisor).toFixed(
      11
    );
    setAge(ageString);
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
  // {
  //   key: 'countries',
  //   label: 'Countries visited',
  //   value: 53,
  //   link: 'https://www.google.com/maps/d/embed?mid=1iBBTscqateQ93pWFVfHCUZXoDu8&z=2',
  // },
  {
    key: 'location',
    label: 'Current city',
    value: 'Washington, DC',
  },
];

export default data;

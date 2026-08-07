import { useEffect, useState } from 'react';
import type { ITableData } from '../../components/Stats/Table';

export interface IPersonalData extends ITableData {}

const Age = () => {
  const [age, setAge] = useState<string>();

  useEffect(() => {
    const divisor = 1000 * 60 * 60 * 24 * 365.2421897; // ms in an average year
    const birthTime = new Date('1993-03-25T00:00:00');

    const tick = () => {
      setAge(((Date.now() - birthTime.getTime()) / divisor).toFixed(11));
    };

    const timer = setInterval(tick, 25);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <>{age}</>;
};

const data: IPersonalData[] = [
  {
    key: 'age',
    label: 'Current age',
    value: <Age />
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
    value: 'Washington, DC'
  }
];

export default data;

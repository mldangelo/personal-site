export interface PersonalStats {
  key: string;
  label: string;
  value: string | number;
  link?: string;
}

const data: PersonalStats[] = [
  {
    key: 'location',
    label: 'Current city',
    value: 'San Francisco, CA',
  },
  {
    key: 'age',
    label: 'Current age',
    value: new Date().getFullYear() - 1990,
  },
  {
    key: 'countries',
    label: 'Countries visited',
    value: 53,
  },
  {
    key: 'languages',
    label: 'Languages',
    value: '(English, Spanish)',
  },
  {
    key: 'drinks',
    label: 'Beverages consumed',
    value: '2821',
  },
];

export default data;

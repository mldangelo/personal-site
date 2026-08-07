import Age from '@/components/ui/age';
import type { StatRow } from '@/components/ui/table';

const data: StatRow[] = [
  {
    key: 'age',
    label: 'Current age',
    value: <Age />
  },
  {
    key: 'location',
    label: 'Current city',
    value: 'Washington, DC'
  }
];

export default data;

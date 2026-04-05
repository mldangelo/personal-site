/**
 * Conforms to https://jsonresume.org/schema/
 */
export interface Position {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

const work: Position[] = [
  {
    name: 'Independent',
    position: 'Software developer',
    url: 'https://eliachrist.com',
    startDate: '2020-01-01',
    summary: `Building on the web with TypeScript and React. Replace this entry in
    src/data/resume/work.ts with your roles and employers.`,
  },
];

export default work;

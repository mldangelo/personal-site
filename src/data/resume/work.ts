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
    summary: `Independent work across Python, TypeScript, and Adobe Photoshop—replace
    this entry in src/data/resume/work.ts with your roles and employers.`,
  },
];

export default work;

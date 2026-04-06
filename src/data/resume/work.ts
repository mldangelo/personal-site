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
    name: 'independent',
    position: 'Software engeneering',
    url: 'https://eliachrist.com',
    startDate: '2023-12-01',
    summary: ``,
  },
];

export default work;

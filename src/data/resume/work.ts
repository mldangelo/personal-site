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
    name: 'Lockheed Martin',
    position: 'Systems Engineering Intern',
    url: 'https://www.lockheedmartin.com',
    startDate: '2026-06-01',
    summary:
      'Systems engineering intern at Lockheed Martin in Mount Laurel, NJ.',
  },
  {
    name: 'Lower Colorado River Authority (LCRA)',
    position: 'Corporate Strategy Intern',
    url: 'https://www.lcra.org',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    summary:
      'Strategy internship at LCRA in Austin, TX, supporting long-term planning around emerging energy technologies.',
    highlights: [
      'Built an interactive Power BI dashboard tracking 4 emerging technologies (SMRs, hydrogen blending, geothermal, and carbon capture), used by a 10+ person strategy team to inform long-term planning by identifying key market opportunities.',
      'Analyzed global IEA and EIA datasets covering 1,000+ power plants to evaluate adoption trends, costs, and capacity factors of next-generation energy sources.',
    ],
  },
  {
    name: 'Camp Kingswood',
    position: 'Counselor',
    url: 'https://campkingswood.org',
    startDate: '2023-06-01',
    endDate: '2024-08-31',
    summary:
      'Summer counselor at Camp Kingswood in Bridgton, ME (summers of 2023 and 2024).',
    highlights: [
      'Individually designed, executed, and led recreational programs for 58 campers and 14 staff members.',
    ],
  },
  {
    name: 'Westport Tennis Club',
    position: 'Coach',
    url: 'http://www.westporttennisclub.com',
    startDate: '2020-06-01',
    endDate: '2023-05-31',
    summary: 'Tennis coach in Westport, CT.',
    highlights: [
      'Taught engaging tennis lessons to kids and adults, fostering a love for the game while ensuring a fun and supportive environment.',
    ],
  },
];

export default work;

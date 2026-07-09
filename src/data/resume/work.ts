/**
 * Conforms to https://jsonresume.org/schema/
 */
export interface Position {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

const work: Position[] = [
  {
    name: 'DrakkarOS',
    position: 'Software Engineer',
    startDate: '2026-01-01',
    summary: 'Software Engineer on a remote-first team based in Oslo, Norway.',
  },
  {
    name: 'FastProBR',
    position: 'Lead Software Engineer',
    startDate: '2021-12-01',
    summary: `Joined as a Fullstack Software Engineer and was promoted to Lead Software Engineer
    after two years building contactless EMV payment systems for urban mobility, including a
    facial-biometrics flow for transaction authorization.`,
    highlights: [
      'Lead full-lifecycle development of payment and mobility platforms, from data modeling and architecture through deployment on Heroku and AWS.',
      'Built client-facing applications that diversified the use of contactless payment methods, including facial biometrics for transaction authorization.',
      'Drive agile delivery as Lead Software Engineer, running Scrum ceremonies and setting technical direction across diverse stacks and platforms.',
      'Partner closely with cross-functional teams to ship production systems end-to-end, from planning through deployment.',
    ],
  },
  {
    name: 'MeanIT Web Consultoria em Desenvolvimento',
    position: 'Fullstack Software Engineer',
    startDate: '2021-07-01',
    endDate: '2021-12-01',
    summary:
      'Built e-commerce systems end-to-end using Angular, React, and Node.js.',
    highlights: [
      'Designed and implemented data layers across MongoDB and SQL Server for client e-commerce platforms.',
      'Ran client-facing meetings and daily Scrum ceremonies, strengthening cross-functional communication and delivery.',
    ],
  },
  {
    name: 'Saraf Controle Patrimonial',
    position: 'IT Support Technician',
    startDate: '2021-01-01',
    endDate: '2021-07-01',
    summary: `Provided application support and QA for a fixed-asset management platform while completing
    initial developer training - a first hands-on step into software development.`,
    highlights: [
      "Tested and supported the company's web and mobile applications for a fixed-asset management system.",
      'Trained customers on system usage and translated support findings into QA feedback for the development team.',
    ],
  },
  {
    name: 'Freelance',
    position: 'Software Engineer',
    startDate: '2020-01-01',
    endDate: '2021-01-01',
    summary:
      'Delivered freelance web development projects using JavaScript and TypeScript.',
  },
];

export default work;

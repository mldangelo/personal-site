/**
 * @typedef {Object} Position
 * Conforms to https://jsonresume.org/schema/
 *
 * @property {string} name - Name of the company
 * @property {string} position - Position title
 * @property {string} url - Company website
 * @property {string} startDate - Start date of the position in YYYY-MM-DD format
 * @property {string|undefined} endDate - End date of the position in YYYY-MM-DD format.
 * If undefined, the position is still active.
 * @property {string|undefined} summary - html/markdown summary of the position
 * @property {string[]} highlights - plain text highlights of the position (bulleted list)
 */
const work = [
  {
    name: 'Carmenta Geospatial Technologies AB',
    position: 'Master Thesis Student: Algorithm Design',
    summary: 'Employed as a thesis student to research algorithms on time-synchronized routing.',
    url: 'https://carmenta.com/',
    startDate: '2025-01',
    endDate: '2025-06',
    highlights: [
      'problem description: compute a path for two UGVs to their goal point while keeping a line-of-sight constraint with a UAV',
    ],
  },
  {
    name: 'Scania Group',
    position: 'Software Engineer Summer Worker',
    summary: 'Worked as a software engineer in the team modular system tools (EMTMV) in R&D of Scania.',
    url: 'https://www.scania.com/',
    startDate: '2024-06',
    endDate: '2024-08',
    highlights: [
      'migrated the frontend of an angular application to the new internal package, modifying over 200 files and 9000 lines of code in the process',
      'improved the runtime of the current algorithm to compute compatible vehicle components by 300%',
      'designed, implemented and tested an algorithm to detect redundant rules for the above mentioned algorithm',
      'participated in fullstack development (mainly html+css+typescript) and code reviews',
    ],
  },
  {
    name: 'Norwegian University of Science and Technology',
    position: 'Teaching Assistant',
    summary: `I worked as a teaching assistant for a course in algorithms and data structures for the bachelor level. 
    There, I helped students with assignments during lab sessions and also helped with grading assignments.`,
    url: 'https://www.ntnu.edu/',
    startDate: '2022-08',
    endDate: '2022-12',
  },
  {
    name: 'Free University of Berlin',
    position: 'Teaching Assistant',
    summary: `Working as a teaching assistant, I contributed to the delivery of a course in database systems.
    There, I led two tutorials of about 25 students each on my own and prepared and went through exercises for the students in these.
    Furthermore, I helped with the creation and grading of assignment sheets and the exam with three other TAs for about 200 students.`,
    url: 'https://www.fu-berlin.de/en/index.html',
    startDate: '2022-08',
    endDate: '2022-12',
  },
  {
    name: 'Daimler AG',
    position: 'Data Science Working Student',
    summary: `Mainly worked on the maintenance and improvement of a machine learning model that predicts prices for used cars.
    Cars from the Daimler AG have highly individual configurations, which is why it is helpful to have a model that can predict
    the price of these when they are sold again. I also took part in the development of other machine-learning projects.`,
    url: 'https://group.mercedes-benz.com/de/',
    startDate: '2019-08',
    endDate: '2019-12',
  },
];

export default work;

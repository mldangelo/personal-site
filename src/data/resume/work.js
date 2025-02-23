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
    position: 'Master Thesis Student: Algorithm Development',
    summary: 'As a thesis student, I focused on researching and developing algorithms for time-synchronized routing of three vehicles (two ground-based and one airborne), ensuring that line-of-sight is maintained between them throughout the routing process.',
    url: 'https://carmenta.com/',
    startDate: '2025-01',
    endDate: '2025-06',
    highlights: [
      'implemented a graphical user interface for the parameter selection and visualization using Carmenta Engine and Qt',
      'conducted a comprehensive survey of state-of-the-art solutions and implemented various algorithms, including LPA* (an extension of A*), dynamic programming, and depth-first search on a line-of-sight constrained graph.',
      'tested, benchmarked, and compared the performance of the developed algorithms.',
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
    summary: 'Served as a teaching assistant for a bachelor-level course in algorithms and data structures. Assisted students during lab sessions, helping them with assignments, and contributed to grading and providing feedback on their work',
    url: 'https://www.ntnu.edu/',
    startDate: '2022-08',
    endDate: '2022-12',
  },
  {
    name: 'Free University of Berlin',
    position: 'Teaching Assistant',
    summary: 'As a teaching assistant for a course in database systems, I independently led two tutorials of approximately 25 students each, preparing and guiding them through exercises. Additionally, I collaborated with three other teaching assistants to create and grade assignment sheets and the final exam for about 200 students.',
    url: 'https://www.fu-berlin.de/en/index.html',
    startDate: '2022-08',
    endDate: '2022-12',
  },
  {
    name: 'Daimler AG',
    position: 'Data Science Working Student',
    summary: 'Focused on the maintenance and enhancement of a machine learning model designed to predict the prices of used cars, particularly for vehicles from Daimler AG, which often have highly customized configurations. The purpose of the model is to accurately estimate resale prices. Additionally, contributed to the development of other machine learning projects.',
    url: 'https://group.mercedes-benz.com/de/',
    startDate: '2019-08',
    endDate: '2019-12',
  },
];

export default work;

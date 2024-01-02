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
    name: 'Norwegian University of Science and Technology',
    position: 'Teaching Assistant',
    summary: `I worked as a teaching assistant for a course in algortihms and data structures for the bachelor level. 
    There, I helped students with assignments during lab sessions and also helped with grading of assignments.`,
    url: 'https://www.ntnu.edu/',
    startDate: '2022-08',
    endDate: '2022-12',
  },
  {
    name: 'Free University of Berlin',
    position: 'Teaching Assistant',
    summary: `Working as a teaching assistant, I contributed to the delivery of a course in database systems.
    There, I lead two tutorials of about 25 students each on my own and prepared and went through exercises for the students in these.
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
    the price of these when they are sold again. I also took part in the development of other machine learning projects.`,
    url: 'https://group.mercedes-benz.com/de/',
    startDate: '2019-08',
    endDate: '2019-12',
  },
];

export default work;

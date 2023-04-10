//

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
    name: 'Arthena',
    position: 'Co-founder, C.T.O.',
    url: 'https://arthena.com',
    startDate: '2014-01-01',
    endDate: '2022-01-01',
    summary: `YC W17. Series A Company funded by <a href="https://www.anthemis.com/">Athemis</a> and 
    acquired by <a href="https://www.masterworks.com/">Masterworks</a> in 2023. 
    `,
    highlights: [
      'Deployed quantitative strategies to predict the value of fine art in various pricing contexts.',
      'Built production, on-line, end-to-end optimized machine learning pipelines with Pandas, Numpy, Scikit, Tensorflow, Dagster, Postgres, etc. on GCP with Kubernetes.',
      'Designed micro-service architecture around: data collection, data integrity, feature engineering, research, strategy, backtesting, deployment, and reporting.',
      'YC Alumni. Worked on everything. Built a 16-person team. Operated company for 7+ years.',
    ],
  },
  {
    name: 'Skeptical Investments',
    position: 'Co-founder',
    url: 'http://skepticalinvestments.biz',
    startDate: '2017-04-01',
    highlights: [
      'Founded a micro-vc fund to throw token amounts of money at problems I find interesting.',
      'Created the InstaSafe. Fast, automated investment docs for YC companies.',
    ],
  },
  {
    name: 'Enveritas',
    position: 'ML Engineering Contractor',
    url: 'http://enveritas.org',
    startDate: '2016-09-01',
    endDate: '2018-01-01',
    highlights: [
      'Trained a model for the Brazilian Coffee Scenes Dataset with better than state of the art accuracy.',
      'Collected training sets on the ground in Uganda. Built dashboards to visualize work of surveyors using Flask, React, and D3.',
      'Performed supporting analysis to ensure data integrity using Pandas, t-SNE, SVM\'s, and other techniques.',
    ],
  },
  {
    name: 'Zenysis',
    position: 'Software Engineering Contractor',
    url: 'https://zenysis.com',
    startDate: '2016-02-01',
    endDate: '2016-03-01',
    highlights: [
      'Worked in Addis Ababa for the Ethiopian Ministry of Health and built data visualization tools in React and Flask.',
      'Ingested multiple databases with different alphabets, calendars, and without official spellings of geographic locations.',
    ],
  },
  {
    name: 'Matroid',
    position: 'Co-founder',
    url: 'https://matroid.com',
    startDate: '2015-07-01',
    endDate: '2016-01-01',
    highlights: [
      'Developed end to end machine learning pipeline to train visual classifiers from keywords using Node.JS, Express, Keystone, MongoDB, AWS, S3, Caffe, and other technologies.',
      'Received Series A term sheets for 20M+ valuations.',
    ],
  },
  {
    name: 'Planet',
    position: 'Missions Intern',
    url: 'https://planet.com',
    startDate: '2014-06-01',
    endDate: '2015-01-01',
    highlights: [
      'Built models to improve image quality, signal to noise ratio, and dynamic range.',
      'Performed statistical analysis of image quality in Matlab and Python.  Developed flight software in C++.',
      'Organized first hackathon, prototyped hardware, and designed and built photography equipment for rocket launches.',
    ],
  },
  {
    name: 'Planetary Resources',
    position: 'Avionics Intern',
    startDate: '2014-01-01',
    endDate: '2014-05-01',
    url: 'http://planetaryresources.com',
    highlights: [
      'Developed simulations in Matlab for Attitude Determination and Control Subsystem.',
      'Developed processes for in lab testing and characterization of various subsystems.',
      'Assembled flight hardware in cleanroom.',
    ],
  },
  {
    name: 'Facebook',
    position: 'Software Engineer Intern',
    url: 'https://facebook.com',
    startDate: '2013-06-01',
    endDate: '2013-09-01',
    highlights: [
      'Developed software in python for automated testing of servers.',
      'Performed statistical analysis with R, HIVE to assist in triage of malfunctioning servers.',
      'Worked with vendors and ODM\'s during triage to assist in risk mitigation.',
    ],
  },
  {
    name: 'SEDS-USA',
    position: 'At Large Board Member',
    url: 'http://seds.org',
    startDate: '2013-10-01',
    endDate: '2014-10-01',
    highlights: [
      'Elected to Board of Directors of the USA\'s largest student space advocacy group based on 5+ years of work with SEDS.',
      'Responsibilities included: organizational strategy, conference presentations, fundraising, special projects, promoting SEDS nationally and internationally, and photographing conferences.',
    ],
  },
  {
    name: 'UB Nanosatellite Program',
    position: 'Co-founder, Program Manager',
    url: 'https://ubnl.space/',
    startDate: '2010-10-01',
    endDate: '2012-06-01',
    highlights: [
      'Coauthored grant to build a multi-spectral imaging satellite as part of the AFRL University Nanosatellite Program.',
      'Lead a team of 60 students through satellite development life cycle. Served as a technical expert, acquired intimate working knowledge of satellite subsystems.  Solicited funding through NASA, AFOSR, and several corporate sponsors.',
    ],
  },
];

export default work;

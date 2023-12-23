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
    name: 'Berkeley AI Research Laboratory',
    position: 'Undergraduate Researcher',
    url: 'https://bair.berkeley.edu/',
    startDate: '2023-08',
    summary: `The Berkeley Artificial Intelligence Research (BAIR) Lab brings together UC Berkeley researchers across the areas of computer vision,
      machine learning, natural language processing, planning, control, and robotics.
      BAIR includes over 50 faculty and more than 300 graduate students and postdoctoral researchers pursuing research on fundamental advances in the above areas as well as cross-cutting themes including multi-modal deep learning,
      human-compatible AI, and connecting AI with other scientific disciplines and the humanities.`,
    highlights: [
      'Researching the effectiveness of tuning models using RLHF for LLM security',
      'Conducted experiments with various SL:RLHF splits on ~28M parameter models to identify the most optimal ratio',
      'Designed/Implemented custom evaluation metrics and graphs to quantify/visualize model performance',
    ],
  },
  {
    name: 'Meditrina Inc.',
    position: 'Software Engineering Consultant',
    url: 'https://www.avetasystem.com/home',
    startDate: '2022-09',
    summary: `Meditrina is an innovative start up Company located in San Jose, CA, and founded in 2016 developed the Aveta™ hysteroscopy suite which was designed to provide physicians with the best care in their diagnosis and treatment of endometrial polyps and uterine fibroids.
      The system seamlessly integrates into any operating, procedure, or exam room. This new hysteroscopy system is an all-in-one platform which includes the single-use Aveta™ Pearl Hysteroscope for myomectomy,
      and the single-use Aveta™ Coral Hysteroscope for polypectomy procedures with integrated tissue resection and fluid management capability.
      The Aveta™ Pearl Hysteroscope is the first single-use hysteroscope to include full physician control providing proprietary fluid management and video control function directly on the hysteroscope handle.`,
    highlights: [
      'Increased circuit board testing efficiency by 1.6x using Pyserial/Shell to program robust automated board testing software',
      'Prototyped hospital image database interface feature using DICOM and AWS EC2 server; presented findings to my team',
      'Improved medical device production efficiency by 30% by fixing existing bugs in deprecated Python product testing software',
    ],
  },
  {
    name: 'Meditrina Inc.',
    position: 'Software Engineering Intern',
    url: 'https://www.avetasystem.com/home',
    startDate: '2022-07-01',
    endDate: '2023-09-15',
    summary: `Meditrina is an innovative start up Company located in San Jose, CA, and founded in 2016 developed the Aveta™ hysteroscopy suite which was designed to provide physicians with the best care in their diagnosis and treatment of endometrial polyps and uterine fibroids.
      The system seamlessly integrates into any operating, procedure, or exam room. This new hysteroscopy system is an all-in-one platform which includes the single-use Aveta™ Pearl Hysteroscope for myomectomy,
      and the single-use Aveta™ Coral Hysteroscope for polypectomy procedures with integrated tissue resection and fluid management capability.
      The Aveta™ Pearl Hysteroscope is the first single-use hysteroscope to include full physician control providing proprietary fluid management and video control function directly on the hysteroscope handle.`,
    highlights: [
      'Programmed updater software for 3 various microcontrollers (MC) using PySerial, deployed to update 150+ controllers in the field',
      'Designed/conducted software/physical unit tests to ensure the functionality of updater code prior to release',
      'Implemented/Debugged two MC bootloaders using C and integrated commands into the pre-existing system',
      'Conducted EMI/EMC product testing to free up senior resources',
    ],
  },
];

export default work;

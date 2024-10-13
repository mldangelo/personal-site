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
    name: 'NVIDIA',
    position: 'ASIC Intern',
    startDate: '2022-06-01',
    endDate: '2022-07-31',
    url: 'https://www.nvidia.com/en-in/',
    highlights: [
      'GPU MSS(Memory SubSystem ) Unit TB UVM Migration for directed and Perf tests',
      'Adding support files for sending specific traffic on interfaces in UVM Testbench',
      'Automated test vector generation , addition of asserts to ensure test coverage and tracking of synthesis metrics over project lifecycle',
      'UVM, System Verilog , Perl , Memory System Architecture ',
    ],
  },
  {
    name: 'DROBOT INC',
    position: 'Hardware Engineer',
    startDate: '2021-10-01',
    endDate: '2021-12-31',
    url: 'https://www.linkedin.com/company/drobot-inc/',
    highlights: [
      'Built scalable software stack for automated robot operation in smart warehouse solution',
      'Designed and showcased a prototype of a 4 wheeled robot with Wheel Encoder, EKF Localization , LIDAR and AI enabled camera working synchronously to optimally follow a designated path',
      'ROS , Gazebo , IoT Architecture , Embedded Systems',
    ],
  },
];

export default work;

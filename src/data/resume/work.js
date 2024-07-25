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
    name: 'Diagonal',
    position: 'Co-Founder & Head of Product',
    url: 'https:diagonal.works',
    startDate: '2020-02-01',
    summary: `Diagonal is a civic tech consultancy specialized in building geospatial
    tools for city planners. As a co-founder I lead product strategy, am responsible for
    shipping products, define team operations, and own financial targets. My work includes:`,
    highlights: [
      'Leading the strategy for product roadmaps.',
      'Managing a cross-functional team of experts in engineering, design, data science, research, sales and marketing.',
      'Shipping and managing the entire life-cycle of open-source products (b6, award-winning PETs) and a B2B SaaS product Skyline: now serving UK government agencies in city planning and public health.',
      'Defining data collection and governance programs with cities (like Manchester City Council, UK) - leading to new product development.',
      'Leading industry panels on the opportunities to leverage open data for city planning.',
      'Establishing company operations, including the legal structure as a steward-owned business and ownership-share management.',
      'Owning financial targets, negotiating contracts with c-level clients, ensuring compliance with public procurement regulation. Diagonal is financially sustainable - delivering work with clients in highly regulated domains like the UK National Health Service (NHS) and other government bodies.',

    ],
  },
  {
    name: 'Arup',
    position: 'Senior Product Manager',
    url: 'http://arup.com',
    startDate: '2014-09-01',
    endDate: '2021-07-01',
    summary: 'During my time at Arup, a global engineering and design consultancy, I had a multifaceted role: I led multiple product teams, built company standards for product management, defined the career pathway for product managers, and mentored product team members - while also shipping open-source products that underpinned Arup’s consulting work. I introduced processes like consequence scanning into Arup product management practice to elevate themes of responsible technology. I redefined hiring practices, engaging with minority and under-represented career development organizations, to make teams more diverse and inclusive. My project work included:',
    highlights: [],
  },
  {
    name: 'Arup-Microsoft Partnership',
    position: 'Senior Program Manager',
    startDate: '2021-04-01',
    endDate: '2021-07-01',
    summary: 'I led a global innovation initiative with C-level stakeholders from Arup and Microsoft to identify and test the viability of new technologies for residential retrofitting. As a result, Arup and Microsoft identified several core values to build a multi-year partnership around, and identified business development opportunities for new, joint offerings.',
    highlights: [
      'Reported directly to Arup’s Global Head of Sustainable development.',
      'Developed a program plan that aligned visions and identified market opportunities.',
      'Facilitated workshops with Arup and Microsoft’s senior leadership and globally renowned technical experts.',
    ],
  },
  {
    name: 'Arup - City Modelling Lab',
    position: 'Senior Product Manager',
    url: 'https://www.arup.com/services/city-modelling-lab/',
    startDate: '2019-02-01',
    endDate: '2021-07-01',
    summary: 'The City Modelling Lab built open-source transport models to simulate how people travel throughout cities and countries. Working with the global heads of Arup’s transport business and engineering, I was responsible for owning the product roadmaps. Under my management, the City Modelling Lab moved from an internally-funded investment program into a core profit-center.',
    highlights: [
      'Delivered >£1 million of project work.',
      'Ran a team of 9 engineers and coordinated with 4 other cross-functional teams to ensure alignment and coordination across domain-specific features.',
      'Designed and ran training programs for transport consultants to engage with the new tools.',
    ],
  },
  {
    name: 'Arup - Mobility Mosaic',
    position: 'Senior Product Manager',
    url: '',
    startDate: '2018-02-01',
    endDate: '2019-02-01',
    summary: 'Mobility Mosaic was an iOS/Android mobile app and suite of travel-inference tools that converted GPS data into population travel behavior insight.',
    highlights: [
      'Led a team of 6 engineers plus domain experts, designers and data analysts to build and ship a mobile travel diary application for public transit agencies.',
      'Managed GDPR compliance requirements.',
      'Responsible for marketing strategy, and operational alignment between the designers, data scientists, mobile app developers and data engineers.',
    ],
  },
  {
    name: 'Arup - Digital + Movement Insight',
    position: 'Product Manager',
    url: '',
    startDate: '2016-09-01',
    endDate: '2018-02-01',
    summary: 'As Product Manager for multiple developer-tools and platform products, I owned the program of work, including financial viability assessments. I aligned product and service vision among multiple senior stakeholders within the company.',
    highlights: [],
  },
  {
    name: 'Arup - City Resilience Index',
    position: 'Product Manager',
    url: 'https://www.cityresilienceindex.org/#/',
    startDate: '2014-09-01',
    endDate: '2016-01-01',
    summary: 'I shipped the City Resilience Index digital platform. Funded by the Rockefeller Foundation, I led a user-centered process to collect technical and functional requirements from city officials. At the start of the program, I was responsible for the design, research, and product management of the tool. By the end, I had built a resilient product team, including mentoring a new product manager to own the service.',
    highlights: [
      'Worked directly with Arup’s Global International Development Leader.',
      'Led agile product development process.',
      'Conducted user research and gathered business requirements.',

    ],
  },
  {
    name: 'RedR UK',
    position: 'Information Analyst',
    startDate: '2013-06-01',
    endDate: '2013-09-01',
    url: 'https://www.redr.org.uk/',
    highlights: [
      'Developed training materials for humanitarian aid workers.',
      'Enabled humanitarian responders to map and share geospatial information critical to emergency events.',
    ],
  },
  {
    name: 'UNESCO',
    position: 'Geographic Information Science Analyst',
    url: 'https://www.unesco.org/en/fieldoffice/bangkok',
    startDate: '2012-10-01',
    endDate: '2013-01-01',
    highlights: [
      'Analyzed demographics data of minority communities in the Northwest of Thailand, so that UNESCO projects could more effectively target populations with healthcare services.',
      'Implemented demographic analysis using MATLAB and Python.',
    ],
  },
  {
    name: 'RECOFTC The Center for People and Forests',
    position: 'Princeton in Asia Fellow',
    url: 'http://seds.org',
    startDate: '2011-08-01',
    endDate: '2012-09-01',
    highlights: [
      'Analyzed smallholder plantation data to connect under-banked communities with microloans, using un-harvested teak trees as a loan collateral.',
      'Organized and facilitated multi-national workshops with governments across Southeast Asia',
      'Created and delivered GIS and IT training for colleagues.',
    ],
  },
];

export default work;

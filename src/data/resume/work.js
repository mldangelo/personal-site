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
 * @property {string[]} projects - List of projects worked on during the position
 * @property {string} projects[].name - Name of the project
 * @property {string} projects[].startDate - Start date of the project in YYYY-MM-DD format
 * @property {string|undefined} projects[].endDate - End date of the project in YYYY-MM-DD format.
 * @property {string|undefined} projects[].summary - Summary of the project
 * @property {string[]} projects[].highlights - Highlights of the project
 */
const work = [
  {
    name: 'SYSTRA India',
    position: 'Transport Planner',
    url: 'https://www.systra.com',
    startDate: '2023-05-01',
    summary: 'Involved marjorly in Strategic and Data Science projects.',
    highlights: [
      'Skills Learned: SATURN Networking Development, CUBE Scripting, TUBA, COBALT',
      'Developed automation tools to streamline transport modeling processes.',
    ],
    projects: [
      {
        name: 'Digital Innovation (Automation Tool)',
        summary: 'Developed a Python-based app to automate strategic transport modeling tasks.',
        startDate: '2024-09-01',
        highlights: [
          'Developed a Python-based app with a PySide GUI to automate strategic transport modeling, accelerating LAM model development.',
          'The Saturn Assistant App generates GIS files (links, nodes, zones, spigots, connectors, routes from the 77777 card) for network checks, with automated shapefile generation from UFN or recreated DAT files.',
          'The app simplifies the conversion of Buffer Networks to Simulation Networks using additional data.',
          'Provides one-click reverse distance, free flow speed, and capacity checks for efficient network analysis.',
          'The app can quickly generate Matrix Validation Plots to compare post vs. prior matrices, including trip length distribution, trip cells, and trip ends, following TAG guidelines.',
          'GitHub Release: https://github.com/shivam-a/saturn-assistant/releases/tag/v0.0.1',
        ],
      },
      {
        name: 'Bus Connects Cork (Strategic)',
        summary: 'Developed and validated transport models for the Cork Bus Connects project.',
        startDate: '2023-10-01',
        highlights: [
          'Cordoned the South West Regional Model (SWRM) network using SATURN to create a specific Local Area Model (LAM).',
          'Developed the Base Model by densifying the network using Google Maps and Street View for accuracy.',
          'Disaggregated and split LAM zones based on administrative boundaries, workplace zones, and data-driven insights to enhance trip-end distribution.',
          'Improved the SATURN network by adding new spigots/connectors and refining demand distribution factors.',
          'Calibrated and validated the Base Model in accordance with TAG guidelines, writing Python scripts to generate TLD files, matrix validation plots, and shapefiles directly from UFS/UFN files.',
          'Modified and prepared DM/DS (Do-Minimum/Do-Something) models to incorporate future transport schemes in Cork.',
          'Assisted in writing CUBE scripts to generate GIS-compatible AADT and flow difference plots between models.',
        ],
      },

      {
        name: 'A404 UK Project (Strategic)',
        summary: 'Contributed to the A404 UK Project by conducting transport modeling and analysis.',
        startDate: '2023-05-01',
        endDate: '2023-09-01',
        highlights: [
          'Conducted speed and road classification checks for Do-Minimum and Do-Something scenarios.',
          'Assisted in report writing by compiling and integrating relevant plots and tables.',
          'Ran the TUBA and COBALT processes, gaining insights into their significance in transport studies.',
        ],
      },
    ],
  },
  {
    name: 'Indian Institute of Technology',
    position: 'Research Associate',
    url: 'https://www.iit.ac.in',
    startDate: '2022-09-01',
    endDate: '2023-04-30',
    summary: 'Conducted traffic modeling, simulation, and economic impact analysis while mentoring students and contributing to research and consultancy projects.',
    highlights: [
      'Developed and tested mixed traffic signals for Indian cities using agent simulator (MATSim).',
      'Used GAMS code to assess economic impacts of network shocks on Transport Economics CGE model.',
      'Evaluated GPS-app data to create OD matrices for trip-based models of Indian cities.',
      'Conducted tutorials on VISSIM and workshops on MATSim for students and participants.',
      'Contributed to the consultancy project on Dadar\'s flood evacuation traffic-simulation model.',
      'Assisted in writing research papers and reports and collaborated with PG scholars.',
      'Maintained and updated project and code documentation.',
    ],
  },
  {
    name: 'Indian Institute of Technology Roorkee',
    position: 'Ad-hoc Research Associate',
    url: 'https://www.iitr.ac.in',
    startDate: '2022-03-01',
    endDate: '2022-05-31',
    summary: 'Developed and debugged traffic simulations, integrated real-time congestion and pollution data, and contributed to published research.',
    highlights: [
      'Debugged Java code integrating real-time traffic congestion and air pollution exposure from HERE Maps API and WAQI API using GraphHopper\'s multi-modal routing engine.',
      'Assisted PG scholars in successful publishing of a research paper in a peer-reviewed journal.',
      'Developed a heterogeneous traffic-based agent-based simulation in MATSim.',
    ],
  },
  {
    name: 'Teralytics AG',
    position: 'Transport Modelling Intern',
    url: 'https://www.teralytics.net',
    startDate: '2021-09-01',
    endDate: '2022-02-28',
    summary: 'Enhanced STREETS product with new features, automated validation and OSM data reporting, conducted research on traffic routing, and managed tasks using agile tools.',
    highlights: [
      'Improved company\'s proprietary product pipeline STREETS by developing and implementing new features using Python.',
      'Automated validation report generation using Airflow and Docker using Python scripts to compare simulated traffic volume with ground truth values.',
      'Developed and automated a script that generates reports on OSM data.',
      'Conducted extensive literature review on routing of vehicles and traffic volume estimation using telco data.',
      'Utilized JIRA, git, and Confluence toolsets for daily stand-up meetings and cultivated an agile working method for managing tasks.',
    ],
  },
  {
    name: 'Technische Universität München',
    position: 'Student Research Assistant',
    url: 'https://www.tum.de',
    startDate: '2021-04-01',
    endDate: '2022-02-28',
    summary: 'Enhanced activity-based modeling with open data, integrated macro-micro transport models, conducted spatial analysis, developed travel demand models, and created a marketing video.',
    highlights: [
      'Improved location-choice and time-choice model of a larger activity-based model by incorporating data from various open data sources including Twitter API and Google popular time.',
      'Collaborated with team members to link macroscopic and microscopic transport modeling and validated open transport model using traditional methods, sensitivity analysis, and meta-analysis.',
      'Conducted spatial data analysis using QGIS, Python, and R libraries to analyze geographic patterns and relationships, identify spatial outliers and anomalies, and support decision-making.',
      'Analyzed, cleaned, and manipulated census tract data to develop the MITO San Francisco model for travel demand generation.',
      'Designed marketing video for the department using After Effects.',
    ],
  },
  {
    name: 'Europäisches Institut für Energieforschung, EIfER',
    position: 'Transportation Research Intern',
    url: 'https://www.eifer.kit.edu',
    startDate: '2020-08-01',
    endDate: '2021-01-31',
    summary: 'Researched activity-based modeling, analyzed household travel data, developed predictive models for EV users, and simulated EV Park-and-Ride behavior in MATSim.',
    highlights: [
      'Conducted extensive research on activity-based modeling/agent-based modeling and its distinction from trip-based models.',
      'Conducted statistical analysis of household travel survey data using Python, including plotting, frequency tables, and various statistical tests, to explore relationships and patterns in the data.',
      'Implemented a Multinomial Logit Model using survey data with biogeme/scikit-learn package to predict home-based activity chains of EV users.',
      'Implemented EV Park and Ride behavior with MATSim-contrib EV and parking modules, enabling the simulation of charging at PuT stops.',
    ],
  },
];

export default work;

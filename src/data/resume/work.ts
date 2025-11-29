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
    name: 'Promptfoo',
    position: 'Co-founder & CTO',
    url: 'https://promptfoo.dev',
    startDate: '2024-07-01',
    summary: `Promptfoo discovers and eliminates LLM risks before they reach production through automated
    red-teaming and vulnerability analysis. Our open-source, developer-first approach has made Promptfoo the most
    widely adopted tool in the LLM eval space, with over 200,000 users at companies like Anthropic, Amazon, and Shopify.`,
    highlights: [
      'Own company-wide technical strategy and product roadmap, balancing open-source community, commercial product, and research investments.',
      'Co-led fundraising and technical due diligence for $23M+ in venture financing from Insight Partners and Andreessen Horowitz.',
      'Built and scaled the engineering team from founding through Series A, including hiring, leveling, and performance management.',
      'Led development of core evaluation framework, vulnerability scanning, and automated red-teaming capabilities.',
    ],
  },
  {
    name: 'Smile Identity',
    position: 'VP Engineering & Head of AI',
    url: 'https://smileidentity.com',
    startDate: '2022-01-01',
    endDate: '2024-07-01',
    summary: `Smile Identity provides ML-powered identity verification APIs used by banks, fintechs, and
    telcos across Africa. Promoted from Director to VP Engineering to VP Engineering & Head of AI within one year,
    joining the executive team and leading teams building APIs that now process hundreds of millions of identity checks.`,
    highlights: [
      'Owned engineering org design, headcount planning, and hiring across backend, mobile, and ML teams, growing to 20+ engineers.',
      'Partnered with Product, Compliance, and Operations to set SLAs, prioritize roadmap, and balance fraud prevention against onboarding friction.',
      'Restructured engineering into domain-specific squads (Platform, ML, Product) to increase delivery velocity and ownership.',
      'Led re-architecture of inference APIs and built computer vision pipelines for liveness detection certification.',
      'Pitched, designed, and shipped a fraud detection product using 1-N facial recognition with embeddings and vector search.',
    ],
  },
  {
    name: 'Skeptical Investments',
    position: 'Co-founder',
    url: 'http://skepticalinvestments.biz',
    startDate: '2017-04-01',
    summary: `Skeptical Investments is a micro-VC fund focused on early-stage technical founders,
    with investments in ML, infrastructure, and space startups.`,
    highlights: [
      'Created InstaSafe, a tool that automates YC-standard investment documents.',
      'Advise portfolio founders on ML, infrastructure, hiring, and fundraising strategy.',
    ],
  },
  {
    name: 'Arthena',
    position: 'Co-founder & CTO',
    url: 'https://arthena.com',
    startDate: '2014-01-01',
    endDate: '2022-01-01',
    summary: `Arthena was a quantitative art investment platform backed by <a href='https://www.anthemis.com/'>Anthemis</a>,
    <a href='https://foundationcapital.com'>Foundation Capital</a>, and <a href='https://ycombinator.com'>Y Combinator</a>.
    Built Arthena from idea through profitability and eventual acquisition by Masterworks in 2023.`,
    highlights: [
      'Co-founded Arthena and led technical strategy from seed through acquisition, including fundraising, investor diligence, and board communication.',
      'Built and managed a cross-functional team of 20 engineers, data scientists, and analysts.',
      'Developed long-term technical vision, evolving the platform from a retail investment tool to an institutional quantitative engine.',
      'Built production ML pipelines for time-series prediction of fine art valuations.',
      'Designed micro-service architecture for data collection, feature engineering, backtesting, and reporting.',
    ],
  },
  {
    name: 'Matroid',
    position: 'Co-founder',
    url: 'https://matroid.com',
    startDate: '2015-01-01',
    endDate: '2016-12-01',
    summary: `Matroid is a computer vision platform for creating and deploying detectors, funded by
    <a href='https://www.nea.com'>NEA</a> and <a href='https://www.accel.com'>Accel</a>. I co-founded
    the company and was responsible for architecting and building the initial product. Left after
    Series A to focus on Arthena.`,
    highlights: [
      'Defined company vision and product roadmap with Reza Zadeh (co-founder & CEO).',
      'Architected and built the initial detector platform for identifying objects, events, and patterns in video.',
      'Prepared technical materials and demos for Series A fundraising.',
    ],
  },
  {
    name: 'Planet',
    position: 'Avionics Intern',
    url: 'https://planet.com',
    startDate: '2014-06-01',
    endDate: '2015-01-01',
    highlights: [
      'Built models incorporating sensor physics, astronomy, and optics to improve image signal-to-noise ratios.',
      'Developed satellite software in C++ and Python (OpenCV, NumPy, SciPy).',
    ],
  },
  {
    name: 'Planetary Resources',
    position: 'Avionics Intern',
    url: 'https://www.planetaryresources.com',
    startDate: '2014-01-01',
    endDate: '2014-05-01',
    highlights: [
      'Wrote optical calibration software in Python.',
      'Developed simulations for Attitude Determination and Control Subsystem.',
      'Built flight hardware for Electrical Power Subsystem.',
    ],
  },
  {
    name: 'Facebook',
    position: 'Software Engineering Intern',
    url: 'https://facebook.com',
    startDate: '2013-06-01',
    endDate: '2013-09-01',
    highlights: [
      'Extended log collection software in Python for server infrastructure.',
      'Performed statistical analysis with R and HQL to identify causal links for server triage.',
    ],
  },
  {
    name: 'UB Nanosatellite Program',
    position: 'Program Manager',
    url: 'https://ubnl.space/',
    startDate: '2011-06-01',
    endDate: '2012-05-01',
    summary:
      'Led a 60-person student team through the satellite development lifecycle for the AFRL University Nanosatellite Program.',
    highlights: [
      'Co-authored grant proposal to design and build a multi-spectral imaging satellite.',
      'Established budget and schedule from initial concept to launch.',
      'Designed and implemented the Attitude Determination and Control System (ADCS).',
    ],
  },
];

export default work;

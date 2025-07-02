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
    summary:
      'Promptfoo builds open-source tools to evaluate, find, and fix vulnerabilities in large language models (LLMs). Our open-source tools are used by over 35,000 developers and researchers worldwide.',
    highlights: [
      'Built and scaled engineering team, emphasizing diversity and open-source contribution',
      'Established key partnerships with AI research institutions and tech companies',
    ],
  },
  {
    name: 'Smile Identity',
    position: 'VP Engineering & Head of AI',
    url: 'https://smileidentity.com',
    startDate: '2022-01-01',
    endDate: '2024-07-01',
    summary: `Smile builds machine learning APIs to compare user submitted photos to ID documents. Our APIs are
    used by hundreds of thousands of people every day to access financial services. As VP of Engineering,
    I provide technical leadership on high-impact projects, influence and coach a distributed team of engineers,
    and facilitate alignment and clarity across teams on goals, outcomes, and timelines. I was promoted
    from Director of Engineering to VP of Engineering in April 2022, and then to VP of Engineering and Head
    of AI in November 2022. I lead a 20+ person engineering org. I directly manage ~8 engineers and spend
    >50% of my time writing code.`,
    highlights: [
      'Redesigned engineering processes for bug tracking, meetings, and standups. Improved culture for code reviews, blameless post-mortems, and retrospectives.',
      'Re-architected engineering hiring and onboarding processes. Recruited several strong engineers.',
      'Reorged engineering teams to focus on product delivery. Created a new team to focus on ML infrastructure.',
      'Lead re-design of internal APIs for inference. Built new computer vision pipelines for industry leading certifications (NIST/iBeta liveness).',
      'Pitched, designed, developed, deployed, and maintain a fraud detection product based on 1-N facial recognition using embeddings and vector search.',
    ],
  },
  {
    name: 'Skeptical Investments',
    position: 'Co-founder',
    url: 'http://skepticalinvestments.biz',
    startDate: '2017-04-01',
    summary: `Skeptical Investments is a micro-VC fund that makes angel investments. I consult with and invest
    in startups in the Bay Area. I work part-time on this.`,
    highlights: [
      'Created the InstaSafe. Fast, automated investment docs for YC companies.',
      'Advise startups on web, mobile, and ML engineering.',
      'Sourced and analyzed over 1,000 startup deals.',
      'Invested in over 60 startups.',
    ],
  },
  {
    name: 'Arthena',
    position: 'Co-founder & CTO',
    url: 'https://arthena.com',
    startDate: '2014-01-01',
    endDate: '2022-01-01',
    summary: `Arthena is a Series A Company funded by <a href='https://www.anthemis.com/'>Anthemis</a>,
    <a href='https://foundationcapital.com'>Foundation Capital</a>, and <a href='https://ycombinator.com'>YCombinator</a>.
    We build quantitative strategies to predict the value of fine art and build investment products.
    I ran a 20-person product and engineering org for 8 years. We were profitable and the #1 art investment platform in the world.`,
    highlights: [
      'Built production models for fine art valuation, resulting in $1.5B in cumulative art valuations (70k+ artworks).',
      'Built computer vision models for artwork identification.',
      'Designed and implemented CRM, data management, and accounting systems. Performed accounting and tax filings.',
      'Set up company structure, worked with lawyers, and raised multiple fundraising rounds.',
      'Managed a team of 15 engineers, data scientists, and analysts.',
    ],
  },
  {
    name: 'Matroid',
    position: 'Co-founder',
    url: 'https://matroid.com',
    startDate: '2016-01-01',
    endDate: '2016-12-01',
    summary: `Matroid is a Series A company funded by <a href='https://www.nea.com'>NEA</a> 
    and <a href='https://www.accel.com'>Accel</a> building computer vision infrastructure.
    I played a crucial role in the company's early development, contributing to both the
    technical foundation and strategic direction.`,
    highlights: [
      'Developed core computer vision algorithms and initial product prototypes.',
      "Worked with the team to define the company's vision and product roadmap.",
      'Collaborated with CEO on fundraising and investor relations.',
    ],
  },
  {
    name: 'Planet',
    position: 'Missions Intern',
    url: 'https://planet.com',
    startDate: '2014-06-01',
    endDate: '2015-01-01',
    highlights: [
      'Developed open source mission control software from scratch in NodeJS.',
      'Integrated with Google Earth, Cesium, and MATLAB.',
    ],
  },
  {
    name: 'Facebook',
    position: 'Intern',
    url: 'https://facebook.com',
    startDate: '2012-06-01',
    endDate: '2012-09-01',
    highlights: [
      "Developed and optimized Facebook's core news feed algorithms.",
      'Worked on large-scale data processing and machine learning infrastructure.',
    ],
  },
  {
    name: 'Startup',
    position: 'Co-founder',
    url: '#',
    startDate: '2012-02-01',
    endDate: '2013-01-01',
    summary: 'Started an NFC-based marketing company with a team of four.',
  },
  {
    name: 'UB Nanosatellite Program',
    position: 'Hardware (Attitude Control) Lead',
    url: 'https://ubnl.space/',
    startDate: '2010-10-01',
    endDate: '2012-06-01',
    summary: 'Developed and implemented attitude control systems for university satellite project.',
    highlights: [
      'Designed Attitude Determination and Control System (ADCS) for satellite.',
      'Integrated sun sensors, magnetometer, and reaction wheels.',
      'Developed algorithms for satellite orientation control.',
    ],
  },
];

export default work;

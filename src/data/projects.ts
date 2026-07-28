/**
 * The register of things I have built.
 *
 * Two groups, both kept deliberately:
 *
 * - `shipped` — work that is or was in production, and can be pointed at.
 * - `archive` — student-era experiments. A register that deletes its own
 *   history is a brochure, so these stay, stepped down rather than removed.
 *
 * Every claim here is lifted from `src/data/resume/work.ts` or
 * `src/data/about.ts`. Those files are the record; this one is a view onto
 * them. Do not add a metric, a date, or a destination that is not already
 * written down there — `src/data/__tests__/projects.test.ts` cross-checks the
 * dates and links of shipped entries against the résumé for exactly that
 * reason.
 */
export type ProjectStatus = 'shipped' | 'archive';

export interface Project {
  title: string;
  /** Role, venue, or one-line positioning. Rendered as a mono label. */
  subtitle?: string;
  /**
   * Where a reader can go and see it. Entries without one are rendered as
   * visibly inert rather than as cards that look clickable and are not.
   */
  link?: string;
  /**
   * Screenshot, where one exists. Optional: the card and the register row are
   * both designed to read on type and rules alone, so a new entry does not
   * need art invented for it.
   */
  image?: string;
  /** ISO date the work started, or the date a one-off shipped. */
  date: string;
  /** ISO date the work ended. Omitted on one-off entries and on live work. */
  endDate?: string;
  /**
   * Still in progress. Drives the one amber reading on the page, which is
   * what `--color-signal` is reserved for. Mutually exclusive with `endDate`.
   */
  ongoing?: boolean;
  desc: string;
  /** Technologies the résumé names for this work. Omitted when it names none. */
  tech?: string[];
  status: ProjectStatus;
}

/**
 * Hand-ordered, most recent activity first within each group. Live work leads;
 * `projects.test.ts` pins that ordering so a new entry cannot be appended into
 * the middle of a decade.
 */
const data: Project[] = [
  {
    title: 'Promptfoo',
    subtitle: 'Co-founder & CTO',
    link: 'https://promptfoo.dev',
    date: '2024-07-01',
    ongoing: true,
    desc: 'Started as a developer-first eval tool and grew into a platform for AI security, red-teaming, and compliance: evaluation framework, vulnerability scanning, static analysis, and automated red-teaming. Reached more than 350,000 developers, 130,000 monthly active users, and teams at more than 25% of the Fortune 500 before joining OpenAI in 2026.',
    status: 'shipped',
  },
  {
    title: 'Codex Security',
    subtitle: 'OpenAI · Research preview',
    link: 'https://openai.com/index/codex-security-now-in-research-preview/',
    date: '2026-03-09',
    ongoing: true,
    desc: 'Securing AI systems and applying AI to software security at OpenAI — using models to find and fix vulnerabilities in code.',
    status: 'shipped',
  },
  {
    title: 'Smile ID',
    subtitle: 'VP Engineering & Head of AI',
    link: 'https://usesmileid.com',
    date: '2022-01-01',
    endDate: '2024-07-01',
    desc: 'ML-powered identity verification APIs used by banks, fintechs, and telcos across Africa. Re-architected inference to scale from 1,000 to more than 1M users per day, cutting job time from over 30 seconds to 7, and shipped a fraud detection product built on 1-N facial recognition.',
    tech: ['AWS Lambda', 'Computer vision', 'Embeddings', 'Vector search'],
    status: 'shipped',
  },
  {
    title: 'Arthena',
    subtitle: 'Co-founder & CTO',
    link: 'https://arthena.com',
    date: '2014-01-01',
    endDate: '2022-01-01',
    desc: 'Quantitative art investment platform backed by Anthemis, Foundation Capital, and Y Combinator. Valuation models over irregularly-sampled time series, plus the data pipelines and research tools behind them. Built from idea to acquisition by Masterworks in 2023.',
    tech: [
      'Graph embeddings',
      'Probabilistic forecasting',
      'Online learning',
      'Micro-services',
    ],
    status: 'shipped',
  },
  {
    title: 'Matroid',
    subtitle: 'Co-founder',
    link: 'https://matroid.com',
    date: '2015-09-01',
    endDate: '2016-06-01',
    desc: 'Computer vision platform for creating and deploying detectors. Architected and built the initial platform for identifying objects, events, and patterns in video, and carried it through the seed round.',
    tech: ['Computer vision'],
    status: 'shipped',
  },
  {
    title: 'Nearest Dollar',
    subtitle: 'BVP Hackathon',
    image: '/images/projects/nearestdollar.jpg',
    date: '2015-11-20',
    desc: 'Connected to bank accounts to round up purchases and donate spare change to charity.',
    tech: ['React', 'Node.js', 'Plaid API', 'MongoDB'],
    status: 'archive',
  },
  {
    title: 'Harvest',
    subtitle: '3rd place at Techcrunch Disrupt SF',
    link: 'https://devpost.com/software/harvest',
    image: '/images/projects/harvest.jpg',
    date: '2015-09-20',
    desc: 'Low-cost crop monitoring to catch irrigation leaks and nutrient deficiencies.',
    tech: ['Python', 'Arduino', 'Computer Vision', 'AWS'],
    status: 'archive',
  },
  {
    title: 'Space Potato',
    subtitle: 'Kickstarter-funded weather balloon',
    link: 'http://www.spacepotato.org',
    image: '/images/projects/spacepotato.jpg',
    date: '2015-06-28',
    desc: 'Potato-powered weather balloon with cameras. Photos published in a coffee table book.',
    tech: ['Hardware', 'GPS', 'Photography'],
    status: 'archive',
  },
  {
    title: 'Cat Detector',
    subtitle: 'CNN for cat breed classification',
    image: '/images/projects/catdetector.jpg',
    date: '2015-05-15',
    desc: 'Classified 60,000+ cats across 80 breeds before server costs shut it down.',
    tech: ['Python', 'TensorFlow', 'CNN', 'AWS'],
    status: 'archive',
  },
  {
    title: 'UB Nanosatellite Program',
    subtitle: 'AFRL University Nanosatellite Program',
    link: 'https://ubnl.space/glados/',
    date: '2011-06-01',
    endDate: '2012-05-01',
    desc: 'Co-authored the grant to design and build a multi-spectral imaging satellite, designed its attitude determination and control, and led a 60-person student team through the development lifecycle.',
    status: 'archive',
  },
];

export default data;

/** The register: production work, most recent first. */
export const shipped = data.filter((project) => project.status === 'shipped');

/** Student-era history, most recent first. */
export const archive = data.filter((project) => project.status === 'archive');

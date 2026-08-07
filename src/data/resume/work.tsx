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
 * @property {string|undefined} blurb - one plain sentence, used by the homepage
 * "Recently" list where the full summary is too long. Not part of the schema.
 */

export interface IWorkExperience {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary: string;
  highlights: string[];
  blurb?: string;
}

const work: IWorkExperience[] = [
  {
    name: 'Fundrise',
    position: 'Director of Engineering',
    url: 'https://fundrise.com',
    startDate: '2026-01-01',
    blurb:
      "Leading the engineering behind Fundrise's AI-enabled products, " +
      'including RealAI.',
    summary:
      'Director of Engineering at [Fundrise](https://fundrise.com/), leading engineering strategy and teams building AI-enabled products including [RealAI](https://realai.com). Set technical direction and architecture, standardized modern stack (React, Next.js, TypeScript, Vercel) to improve shipping velocity, and built high-performing teams delivering customer-facing products.',
    highlights: [
      'Set technical direction and architecture decisions for RealAI product.',
      'Standardized tech stack (React, Next.js, TypeScript, Vercel, AWS) to improve shipping velocity and code quality.',
      'Built and mentored engineering leadership.'
    ]
  },
  {
    name: 'Fundrise',
    position: 'Lead Software Engineer | Engineering Manager',
    url: 'https://fundrise.com',
    startDate: '2022-01-01',
    endDate: '2025-12-31',
    blurb:
      'Took RealAI from early prototype through launch, and shipped Equitize.',
    summary:
      "Led engineering team shipping new products, including [RealAI](https://realai.com), Fundrise's flagship AI product. Drove product strategy and team structure to match technical requirements; managed all phases from conception through go-to-market.",
    highlights: [
      'Led team building AI-enabled web applications using modern stack (TypeScript, React, Vue3, Java, Spring Boot, PostgreSQL, AWS).',
      'Architected and shipped [RealAI](https://realai.com) from conception to launch, establishing technical roadmap and modern AI/ML practices.',
      'Shipped Equitize product from conception to launch, scaling to millions in transaction volume.',
      'Drove alignment between engineering, product, and leadership on project scope, technical requirements, and go-to-market strategy.',
      'Adopted modern dev tools ([Testcontainers](https://testcontainers.com/), [Retool](https://retool.com/), [Auth0](https://auth0.com/), Java 21, [JOOQ](https://www.jooq.org/), [GraphQL](https://graphql.org/)) to reduce development friction and improve team velocity.'
    ]
  },
  {
    name: 'Fundrise',
    position: 'Senior Software Engineer',
    url: 'https://fundrise.com',
    startDate: '2021-01-01',
    endDate: '2022-01-01',
    blurb:
      "Owned the platform's payments systems, including ACH processing and a " +
      'new debit funding integration with Stripe.',
    summary:
      'Owned Daily Processing infrastructure handling payments, KYC, and share issuance. Led three major system overhauls: ACH processing architecture rewrite, transfer agent reconciliation automation, and new payment methods integration.',
    highlights: [
      'Architected new ACH processing system handling $1B+ in annual transaction volume.',
      'Shipped [Stripe](https://stripe.com/) debit funding integration, processing 40k+ transactions in year one.',
      'Automated transfer agent reconciliation, eliminating manual shareholding processing and reconciliation errors.',
      'Built department-wide test data framework, enabling rapid local development iteration across engineering.'
    ]
  },
  {
    name: 'Fundrise',
    position: 'Software Engineer',
    url: 'https://fundrise.com',
    startDate: '2019-11-01',
    endDate: '2021-01-01',
    summary:
      'Built IRA and Short Term Notes products from inception. Owned auto-invest scheduling and KYC system development, delivering core infrastructure for new product lines.',
    highlights: [
      'Shipped IRA product from conception to production, establishing new asset class offering.',
      'Designed and shipped Short Term Notes backend processing system.',
      'Streamlined KYC and investment approval workflows, reducing approval time and processing errors.'
    ]
  },
  {
    name: 'Travelers',
    position: 'Associate Software Developer',
    url: 'https://www.travelers.com',
    startDate: '2019-04-01',
    endDate: '2019-11-01',
    summary:
      'Built proprietary software and ML pipeline systems. Developed deployment execution management platform using Java, Spring Boot, and Python.',
    highlights: [
      'Shipped proprietary software and platforms using Java, Spring Boot, Python.',
      'Built ML pipeline components working with SQLServer and Oracle data systems.'
    ]
  },
  {
    name: 'Travelers',
    position: 'Senior Software Programmer',
    url: 'https://www.travelers.com',
    startDate: '2017-04-01',
    endDate: '2019-04-01',
    summary:
      'Owned development of internal applications and tools using Java and Spring Boot. Led modernization effort, migrating legacy systems to modern tech stack.',
    highlights: [
      'Migrated legacy Perl tooling suite to modern Python and Java/Spring Boot applications, reducing maintenance overhead and improving developer experience.',
      'Shipped Python and Java applications replacing legacy Perl systems across proprietary software.'
    ]
  },
  {
    name: 'Travelers',
    position: 'Software Programmer',
    url: 'https://www.travelers.com',
    startDate: '2016-03-01',
    endDate: '2017-04-01',
    summary:
      'Developed proprietary software and systems using Java, Python, and SQL. Owned release process and production deployment execution.',
    highlights: [
      'Shipped proprietary software using Perl, Java, Spring Boot.',
      'Owned release process, executing nightly production deployments as part of deployment train.'
    ]
  }
];

export default work;

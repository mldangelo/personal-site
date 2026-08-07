import type { ReactNode } from 'react';

export const name = 'Austin Dase';
export const email = 'hi@dase.dev';
export const role = 'Director of Engineering, Fundrise';
export const location = 'Washington, DC / Maryland';

/** First professional software role — the meta row counts forward from here. */
const CAREER_START = 2016;

const yearsInSoftware = new Date().getFullYear() - CAREER_START;

/** Facts thin enough to sit on one line, rendered as a `·`-separated row. */
export const meta: { id: string; body: ReactNode }[] = [
  { id: 'tenure', body: `${yearsInSoftware} yrs in software` },
  {
    id: 'degree',
    body: (
      <>
        M.S. Computer Science,{' '}
        <a href="https://www.towson.edu">Towson &rsquo;19</a>
      </>
    )
  },
  { id: 'location', body: location }
];

export const earlier =
  'Earlier: Proprietary software and ML pipelines at Travelers, 2016–2019.';

/**
 * Keyed rather than positional so consumers can render a subset — the profile
 * aside takes only the first paragraph. Emphasis marks the two things worth
 * remembering rather than linking every proper noun; the underline is the
 * accent, so it has to stay rare.
 *
 * These all point off-site, so they are plain anchors: next/link is for
 * in-app navigation and buys nothing here.
 */
export const bio: { id: string; body: ReactNode }[] = [
  {
    id: 'work',
    body: (
      <>
        I&apos;m a software engineer working at the intersection of fintech and
        applied AI. At{' '}
        <a href="https://fundrise.com" className="mark">
          Fundrise
        </a>
        , I lead the engineering behind AI-enabled products including{' '}
        <a href="https://realai.com" className="mark">
          RealAI
        </a>
        , alongside a background in the payments and compliance systems the
        Fundrise platform runs on.
      </>
    )
  },
  {
    id: 'approach',
    body: (
      <>
        Before Fundrise, I worked on proprietary software and machine learning
        pipelines at{' '}
        <a href="https://www.travelers.com" className="mark">
          Travelers
        </a>
        .
      </>
    )
  }
];

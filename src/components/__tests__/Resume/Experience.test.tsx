import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Experience from '../../Resume/Experience';

const mockJobs = [
  {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-01',
    endDate: '2023-06-30',
    summary: 'Led engineering team.',
    highlights: ['Built features', 'Improved performance'],
  },
  {
    name: 'Startup Inc',
    position: 'Software Engineer',
    url: 'https://startup.com',
    startDate: '2018-01-01',
    endDate: '2019-12-31',
    highlights: ['Wrote code'],
  },
];

describe('Experience', () => {
  // Only the fallback-read test fakes the clock, but the suite is shuffled, so
  // the restore has to be unconditional.
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the experience section with title', () => {
    render(<Experience data={mockJobs} />);

    expect(
      screen.getByRole('heading', { name: /experience/i }),
    ).toBeInTheDocument();
  });

  it('renders all jobs', () => {
    render(<Experience data={mockJobs} />);

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Startup Inc')).toBeInTheDocument();
  });

  it('renders job positions', () => {
    render(<Experience data={mockJobs} />);

    expect(screen.getByText(/Senior Engineer/)).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
  });

  it('renders jobs with company links', () => {
    render(<Experience data={mockJobs} />);

    const links = screen.getAllByRole('link');
    expect(
      links.some((l) => l.getAttribute('href') === 'https://acme.com'),
    ).toBe(true);
    expect(
      links.some((l) => l.getAttribute('href') === 'https://startup.com'),
    ).toBe(true);
  });

  it('handles empty jobs array', () => {
    render(<Experience data={[]} />);

    expect(
      screen.getByRole('heading', { name: /experience/i }),
    ).toBeInTheDocument();
    // No job articles
    const articles = document.querySelectorAll('.jobs-container');
    expect(articles.length).toBe(0);
  });

  /**
   * The spine used to render in raw array order, and the real data had drifted
   * out of sequence, so a section that reads as a timeline ran backwards in the
   * middle. `tierFor` was already written not to depend on array position;
   * sorting is the other half of that.
   */
  it('renders the most recently held role first regardless of source order', () => {
    const shuffled = [
      {
        ...mockJobs[1],
        name: 'Oldest Co',
        startDate: '2014-01-01',
        endDate: '2015-01-01',
      },
      {
        ...mockJobs[0],
        name: 'Newest Co',
        startDate: '2023-01-01',
        endDate: '2024-01-01',
      },
      {
        ...mockJobs[1],
        name: 'Middle Co',
        startDate: '2018-01-01',
        endDate: '2019-01-01',
      },
    ];

    render(<Experience data={shuffled} />);

    const companies = Array.from(document.querySelectorAll('.job-company')).map(
      (node) => node.textContent,
    );

    expect(companies).toEqual(['Newest Co', 'Middle Co', 'Oldest Co']);
  });

  it('gives the lead tier to the newest substantive start', () => {
    const shuffled = [
      { ...mockJobs[1], name: 'Oldest Co', startDate: '2015-01-01' },
      { ...mockJobs[0], name: 'Newest Co', startDate: '2024-01-01' },
    ];

    render(<Experience data={shuffled} />);

    const lead = document.querySelector('.jobs-container--lead');
    expect(lead?.querySelector('.job-company')?.textContent).toBe('Newest Co');
  });

  /**
   * The lead tier and the render order are two readings of the same list, and
   * they used to be derived separately — the order from `timelineKey`, the lead
   * from the newest `startDate`. When those disagree the heaviest entry on the
   * page is not the one at the top of it. Here the brief stint began later but
   * has closed, so the ongoing role renders first and has to carry the weight.
   */
  it('puts the lead tier on the role it renders first', () => {
    render(
      <Experience
        data={[
          {
            ...mockJobs[0],
            name: 'Long Ongoing Co',
            startDate: '2015-01-01',
            endDate: undefined,
          },
          {
            ...mockJobs[1],
            name: 'Brief Recent Co',
            startDate: '2024-01-01',
            endDate: '2024-06-01',
          },
        ]}
        now={new Date('2026-07-28T12:00:00Z').getTime()}
      />,
    );

    const tiers = Array.from(document.querySelectorAll('.jobs-container')).map(
      (node) => ({
        company: node.querySelector('.job-company')?.textContent,
        lead: node.classList.contains('jobs-container--lead'),
      }),
    );

    expect(tiers).toEqual([
      { company: 'Long Ongoing Co', lead: true },
      { company: 'Brief Recent Co', lead: false },
    ]);
  });

  it('measures every ongoing role against a single shared instant', () => {
    const now = new Date('2026-07-28T12:00:00Z').getTime();

    render(
      <Experience
        data={[
          { ...mockJobs[0], name: 'Still Going', endDate: undefined },
          { ...mockJobs[1], name: 'Also Going', endDate: undefined },
        ]}
        now={now}
      />,
    );

    const durations = Array.from(
      document.querySelectorAll('.daterange-duration [aria-hidden="true"]'),
    ).map((node) => node.textContent);

    // 2020-01-01 and 2018-01-01 respectively, both measured to `now`.
    expect(durations).toEqual(['6 yr 6 mo', '8 yr 6 mo']);
  });

  /**
   * `now` is optional here and omitting it does read the clock — but once, at
   * the top of the section, and the reading is threaded to every role. `Job`
   * requires the instant so that stays true; this pins the fallback path.
   */
  it('falls back to one clock read shared by the whole spine', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 28, 12, 0, 0));

    render(
      <Experience
        data={[
          { ...mockJobs[0], name: 'Still Going', endDate: undefined },
          { ...mockJobs[1], name: 'Also Going', endDate: undefined },
        ]}
      />,
    );

    const durations = Array.from(
      document.querySelectorAll('.daterange-duration [aria-hidden="true"]'),
    ).map((node) => node.textContent);

    expect(durations).toEqual(['6 yr 6 mo', '8 yr 6 mo']);
  });
});

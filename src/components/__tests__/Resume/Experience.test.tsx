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
  it('renders newest first regardless of the order it is handed', () => {
    const shuffled = [
      { ...mockJobs[1], name: 'Oldest Co', startDate: '2015-01-01' },
      { ...mockJobs[0], name: 'Newest Co', startDate: '2024-01-01' },
      { ...mockJobs[1], name: 'Middle Co', startDate: '2019-01-01' },
    ];

    render(<Experience data={shuffled} />);

    const companies = Array.from(document.querySelectorAll('.job-company')).map(
      (node) => node.textContent,
    );

    expect(companies).toEqual(['Newest Co', 'Middle Co', 'Oldest Co']);
  });

  it('gives the lead tier to the newest role after sorting', () => {
    const shuffled = [
      { ...mockJobs[1], name: 'Oldest Co', startDate: '2015-01-01' },
      { ...mockJobs[0], name: 'Newest Co', startDate: '2024-01-01' },
    ];

    render(<Experience data={shuffled} />);

    const first = document.querySelector('.jobs-container');
    expect(first).toHaveClass('jobs-container--lead');
    expect(first?.querySelector('.job-company')?.textContent).toBe('Newest Co');
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
      document.querySelectorAll('.daterange-duration'),
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
      document.querySelectorAll('.daterange-duration'),
    ).map((node) => node.textContent);

    expect(durations).toEqual(['6 yr 6 mo', '8 yr 6 mo']);
  });
});

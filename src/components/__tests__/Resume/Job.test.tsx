import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Job from '../../Resume/Experience/Job';

const NOW = new Date(2026, 6, 28, 12, 0, 0).getTime();

describe('Job', () => {
  const mockJob = {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    url: 'https://acme.com',
    startDate: '2020-01-15',
    endDate: '2023-06-30',
    summary: 'Led development of **critical systems**.',
    highlights: ['Shipped feature X', 'Improved performance by 50%'],
  };

  it('renders company name with link', () => {
    render(<Job data={mockJob} now={NOW} />);

    const link = screen.getByRole('link', { name: /acme corp/i });
    expect(link).toHaveAttribute('href', 'https://acme.com');
  });

  it('renders position title', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Senior Engineer',
    );
  });

  /**
   * Short months. Spelled out, "January 2014 – January 2022" broke over two
   * lines of the date gutter while "March 2026 – Present" sat on one.
   */
  it('sets the range in short months and keeps the full dates for machines', () => {
    render(<Job data={mockJob} now={NOW} />);

    const dates = [...document.querySelectorAll('.daterange time')];

    expect(dates.map((date) => date.textContent)).toEqual([
      'Jan 2020',
      'Jun 2023',
    ]);
    expect(dates.map((date) => date.getAttribute('datetime'))).toEqual([
      '2020-01-15',
      '2023-06-30',
    ]);
  });

  it('abbreviates the longest month names too', () => {
    render(
      <Job
        data={{ ...mockJob, startDate: '2015-09-01', endDate: '2016-02-01' }}
        now={NOW}
      />,
    );

    expect(
      [...document.querySelectorAll('.daterange time')].map(
        (date) => date.textContent,
      ),
    ).toEqual(['Sep 2015', 'Feb 2016']);
  });

  it('reads the range aloud as "to", with the dash kept from a screen reader', () => {
    render(<Job data={mockJob} now={NOW} />);

    const range = document.querySelector('.daterange') as HTMLElement;

    expect(range.querySelector('.daterange-sep')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(range.querySelector('.daterange-sep + .sr-only')?.textContent).toBe(
      ' to ',
    );
  });

  // The stylesheet places the tick against the date line, so that is where
  // it has to be: moved out, it would be positioned against the whole entry.
  it('keeps the spine tick inside the date line it marks', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(document.querySelector('.daterange > .job-marker')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  // Only layout separated the two, so the heading was named as one phrase:
  // "UB Nanosatellite Program Program Manager".
  it('names the heading with the company and the role apart', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe(
      'Acme Corp, Senior Engineer',
    );
  });

  it('shows Present for current job (no end date)', () => {
    const currentJob = {
      ...mockJob,
      endDate: undefined,
    };

    render(<Job data={currentJob} now={NOW} />);

    expect(screen.getByText(/present/i)).toBeInTheDocument();
  });

  it('renders summary with markdown', () => {
    render(<Job data={mockJob} now={NOW} />);

    // Summary text should be present
    expect(screen.getByText(/led development of/i)).toBeInTheDocument();
  });

  it('renders highlights as list items', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
    expect(screen.getByText('Improved performance by 50%')).toBeInTheDocument();

    const listItems = document.querySelectorAll('.points li');
    expect(listItems.length).toBe(2);
  });

  it('handles missing summary gracefully', () => {
    const jobWithoutSummary = {
      ...mockJob,
      summary: undefined,
    };

    render(<Job data={jobWithoutSummary} now={NOW} />);

    // Should not crash, highlights should still render
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
  });

  it('handles missing highlights gracefully', () => {
    const jobWithoutHighlights = {
      ...mockJob,
      highlights: undefined,
    };

    render(<Job data={jobWithoutHighlights} now={NOW} />);

    // Should not crash, summary should still render
    expect(screen.getByText(/led development/i)).toBeInTheDocument();

    const list = document.querySelector('.points');
    expect(list).not.toBeInTheDocument();
  });

  it('renders as article element', () => {
    render(<Job data={mockJob} now={NOW} />);

    const article = document.querySelector('article.jobs-container');
    expect(article).toBeInTheDocument();
  });

  it('derives the tenure from the two dates', () => {
    render(<Job data={mockJob} now={NOW} />);

    // 2020-01-15 to 2023-06-30.
    const duration = document.querySelector('.daterange-duration');
    expect(duration?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      '3 yr 5 mo',
    );
    expect(duration?.querySelector('.sr-only')).toHaveTextContent(
      'Duration: 3 years 5 months',
    );
  });

  it('measures an ongoing role to the instant it is given, hedged', () => {
    render(<Job data={{ ...mockJob, endDate: undefined }} now={NOW} />);

    const duration = document.querySelector('.daterange-duration');
    expect(duration?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      '6 yr 6 mo+',
    );
    expect(duration?.querySelector('.sr-only')).toHaveTextContent(
      'Duration: 6 years 6 months or more',
    );
  });

  // "<1 mo" is already an upper bound; hedging it would read "less than 1
  // month or more", bracketing the value from both sides at once.
  it('does not hedge an ongoing role that has not run a whole month', () => {
    render(
      <Job
        data={{ ...mockJob, startDate: '2026-08-01', endDate: undefined }}
        now={new Date('2026-08-11T12:00:00Z').getTime()}
      />,
    );

    const duration = document.querySelector('.daterange-duration');
    expect(duration?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      '<1 mo',
    );
    expect(duration?.querySelector('.sr-only')).toHaveTextContent(
      'Duration: less than 1 month',
    );
  });

  /**
   * A summary written on one line parses as inline content, which came back
   * with no paragraph around it: the text reached the page bare, outside
   * every `.summary` rule.
   */
  it('wraps a one-line summary in its paragraph like any other', () => {
    render(
      <Job
        data={{ ...mockJob, summary: 'Led a 60-person student team.' }}
        now={NOW}
      />,
    );

    expect(document.querySelector('p.summary')?.textContent).toBe(
      'Led a 60-person student team.',
    );
  });

  describe('typographic quotes', () => {
    it('sets them in highlights', () => {
      render(
        <Job
          data={{
            ...mockJob,
            highlights: [
              "Worked on Facebook's first GPU compute team.",
              'Shipped the "detectors" people asked for.',
            ],
          }}
          now={NOW}
        />,
      );

      expect(
        [...document.querySelectorAll('.points li')].map(
          (item) => item.textContent,
        ),
      ).toEqual([
        'Worked on Facebook’s first GPU compute team.',
        'Shipped the “detectors” people asked for.',
      ]);
    });

    it('sets them in the company and the role', () => {
      render(
        <Job
          data={{
            ...mockJob,
            name: "McKinsey's Lab",
            position: "Founder's Associate",
          }}
          now={NOW}
        />,
      );

      expect(document.querySelector('.job-company')?.textContent).toBe(
        'McKinsey’s Lab',
      );
      expect(document.querySelector('.job-position')?.textContent).toBe(
        'Founder’s Associate',
      );
    });

    /**
     * The summaries are Markdown with inline anchors whose `href` is quoted
     * with apostrophes. Converting the source string turns those into part of
     * the address — `’https://…’` — and every citation becomes a dead
     * relative link, so the conversion is per text node, after parsing.
     */
    it('sets them in a summary without reaching into its links', () => {
      render(
        <Job
          data={{
            ...mockJob,
            summary: `Backed by <a href='https://example.com/fund'>Acme's fund</a>,
              and it's what "everyone" used.`,
          }}
          now={NOW}
        />,
      );

      const summary = document.querySelector('p.summary') as HTMLElement;
      const link = summary.querySelector('a') as HTMLAnchorElement;

      expect(link.getAttribute('href')).toBe('https://example.com/fund');
      expect(link.textContent).toBe('Acme’s fund');
      expect(summary.textContent?.replace(/\s+/g, ' ')).toBe(
        'Backed by Acme’s fund, and it’s what “everyone” used.',
      );
    });

    it('leaves code in a summary as it was written', () => {
      render(
        <Job
          data={{
            ...mockJob,
            summary: "It's installed with `npm i 'left-pad'` and nothing else.",
          }}
          now={NOW}
        />,
      );

      expect(document.querySelector('p.summary')?.textContent).toBe(
        "It’s installed with npm i 'left-pad' and nothing else.",
      );
    });
  });
});

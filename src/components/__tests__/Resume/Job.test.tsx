import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Job from '../../Resume/Experience/Job';

/**
 * `Job` requires the instant an ongoing role is measured to, so no test here
 * can accidentally measure against the clock the suite happens to run on.
 * Local time, to match the local midnight dayjs reads the ISO dates as.
 */
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

  it('formats date range correctly', () => {
    render(<Job data={mockJob} now={NOW} />);

    expect(screen.getByText(/january 2020/i)).toBeInTheDocument();
    expect(screen.getByText(/june 2023/i)).toBeInTheDocument();
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
    expect(document.querySelector('.daterange-duration')?.textContent).toBe(
      '3 yr 5 mo',
    );
  });

  /**
   * Rendered at two instants rather than one: a single reading is also what a
   * component reading the clock for itself would produce, so only the second
   * render distinguishes the required prop from a default.
   */
  it('measures an ongoing role to the instant it is given', () => {
    const { container } = render(
      <Job data={{ ...mockJob, endDate: undefined }} now={NOW} />,
    );
    const { container: aYearOn } = render(
      <Job
        data={{ ...mockJob, endDate: undefined }}
        now={new Date(2027, 6, 28, 12, 0, 0).getTime()}
      />,
    );

    // Both from 2020-01-15, to the given instant rather than to whenever the
    // suite runs.
    expect(container.querySelector('.daterange-duration')?.textContent).toBe(
      '6 yr 6 mo',
    );
    expect(aYearOn.querySelector('.daterange-duration')?.textContent).toBe(
      '7 yr 6 mo',
    );
  });

  it('keeps the tenure inside the date range so it shares the gutter', () => {
    render(<Job data={mockJob} now={NOW} />);

    const duration = document.querySelector('.daterange-duration');
    expect(duration?.parentElement).toHaveClass('daterange');
  });

  /**
   * Amber is reserved for live values and is already spent on "Present" one
   * word earlier. Marking the same fact twice is what makes the signal stop
   * meaning anything, so the tenure stays quiet on every role.
   */
  it('does not claim the live signal for the tenure', () => {
    render(<Job data={{ ...mockJob, endDate: undefined }} now={NOW} />);

    expect(document.querySelector('.daterange-duration')).not.toHaveClass(
      'daterange-present',
    );
  });
});

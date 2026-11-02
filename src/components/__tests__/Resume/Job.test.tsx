import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Position } from '@/data/resume/work';
import Job from '../../Resume/Experience/Job';

const NOW = new Date(2026, 6, 28, 12, 0, 0).getTime();

const mockJob: Position = {
  name: 'Acme Corp',
  position: 'Senior Engineer',
  url: 'https://acme.com',
  startDate: '2020-01-15',
  endDate: '2023-06-30',
  summary: 'Led development of **critical systems**.',
  highlights: ['Shipped feature X', 'Improved performance by 50%'],
};

function renderJob(overrides: Partial<Position> = {}, now = NOW) {
  render(<Job data={{ ...mockJob, ...overrides }} now={now} />);
}

function textOf(selector: string) {
  return document.querySelector(selector)?.textContent;
}

describe('Job', () => {
  // Only layout separates the two, so the name needs its own separator.
  it('names the heading with the company and the role apart', () => {
    renderJob();

    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe(
      'Acme Corp, Senior Engineer',
    );
  });

  it('sets the range in short months and reads it aloud with "to"', () => {
    renderJob();

    expect(screen.getByText('Jan 2020')).toHaveAttribute(
      'datetime',
      '2020-01-15',
    );
    expect(screen.getByText('Jun 2023')).toHaveAttribute(
      'datetime',
      '2023-06-30',
    );
    expect(document.querySelector('.daterange-sep')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(textOf('.daterange-sep + .sr-only')).toBe(' to ');
  });

  // An ongoing tenure is measured at build time, so it is a floor. "<1 mo" is
  // already an upper bound; hedging it would bracket the value from both sides.
  it.each([
    ['a closed role', {}, NOW, '3 yr 5 mo', 'Duration: 3 years 5 months'],
    [
      'an ongoing role, as a floor',
      { endDate: undefined },
      NOW,
      '6 yr 6 mo+',
      'Duration: 6 years 6 months or more',
    ],
    [
      'an ongoing role under a month, unhedged',
      { startDate: '2026-08-01', endDate: undefined },
      new Date('2026-08-11T12:00:00Z').getTime(),
      '<1 mo',
      'Duration: less than 1 month',
    ],
  ])('derives the tenure of %s', (_, overrides, now, short, long) => {
    renderJob(overrides, now);

    const duration = document.querySelector('.daterange-duration');

    expect(duration?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      short,
    );
    expect(duration?.querySelector('.sr-only')).toHaveTextContent(long);
  });

  it('shows Present for a role with no end date', () => {
    renderJob({ endDate: undefined });

    expect(screen.getByText('Present')).toBeInTheDocument();
  });

  // Inline-only Markdown parses without a paragraph, which would put the text
  // outside every `.summary` rule.
  it.each([
    ['Led **critical** systems.', 'Led critical systems.'],
    ['Led a team.', 'Led a team.'],
  ])('renders the summary %s in its paragraph', (summary, text) => {
    renderJob({ summary });

    expect(textOf('p.summary')).toBe(text);
    expect(document.querySelectorAll('.points li')).toHaveLength(2);
  });

  it('renders neither block when absent', () => {
    renderJob({ summary: undefined, highlights: undefined });

    expect(document.querySelector('.summary')).toBeNull();
    expect(document.querySelector('.points')).toBeNull();
  });

  // Summaries carry anchors whose `href` is quoted with apostrophes, so the
  // conversion has to run per text node, after parsing, or every citation
  // becomes a dead relative link. Code stays as it was written.
  it('sets typographic quotes everywhere except link targets and code', () => {
    renderJob({
      name: "McKinsey's Lab",
      position: "Founder's Associate",
      highlights: ['Shipped the "detectors" people asked for.'],
      summary: `Backed by <a href='https://example.com/fund'>Acme's fund</a>,
        and it's what "everyone" ran: \`npm i 'left-pad'\`.`,
    });

    expect(textOf('.job-company')).toBe('McKinsey’s Lab');
    expect(textOf('.job-position')).toBe('Founder’s Associate');
    expect(textOf('.points li')).toBe(
      'Shipped the “detectors” people asked for.',
    );
    expect(document.querySelector('p.summary a')?.getAttribute('href')).toBe(
      'https://example.com/fund',
    );
    expect(textOf('p.summary')?.replace(/\s+/g, ' ')).toBe(
      "Backed by Acme’s fund, and it’s what “everyone” ran: npm i 'left-pad'.",
    );
  });
});

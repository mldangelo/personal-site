import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DateRange from '../../Projects/DateRange';

describe('DateRange', () => {
  /**
   * The archive was truncating every date to its year, so four projects a
   * fortnight apart in 2015 all read "2015" and the register looked frozen.
   */
  it('distinguishes two dates in the same year', () => {
    const { container: may } = render(<DateRange date="2015-05-15" />);
    const { container: november } = render(<DateRange date="2015-11-20" />);

    expect(may.textContent).toBe('May 2015');
    expect(november.textContent).toBe('Nov 2015');
  });

  it('renders a single date when nothing bounds it', () => {
    const { container } = render(<DateRange date="2015-06-28" />);

    expect(container.querySelectorAll('time')).toHaveLength(1);
    expect(container.querySelector('.daterange-sep')).not.toBeInTheDocument();
  });

  it('keeps machine-readable dates on both ends of a range', () => {
    const { container } = render(
      <DateRange date="2014-01-01" endDate="2022-01-01" />,
    );
    const times = [...container.querySelectorAll('time')];

    expect(times.map((time) => time.getAttribute('datetime'))).toEqual([
      '2014-01-01',
      '2022-01-01',
    ]);
  });

  it('reads ongoing work as present with no end date attached', () => {
    const { container } = render(<DateRange date="2024-07-01" ongoing />);

    expect(container.querySelectorAll('time')).toHaveLength(1);
    expect(container.querySelector('.daterange-present')).toHaveTextContent(
      'Present',
    );
  });
});

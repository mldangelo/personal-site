import { describe, expect, it } from 'vitest';

import work from '../resume/work';

describe('work data', () => {
  // Timeline ordering compares these strings directly, so a date written any
  // other way (`2014/01`, `Jan 2014`) would sort wrongly and silently.
  it('uses plain ISO calendar dates, with an end after the start', () => {
    for (const { name, startDate, endDate } of work) {
      for (const date of endDate ? [startDate, endDate] : [startDate]) {
        expect(new Date(`${date}T00:00:00.000Z`).toISOString(), name).toBe(
          `${date}T00:00:00.000Z`,
        );
      }

      if (endDate) expect(endDate > startDate, name).toBe(true);
    }
  });
});

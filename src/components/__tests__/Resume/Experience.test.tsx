import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Experience from '../../Resume/Experience';

function job(name: string, startDate: string, endDate?: string) {
  return { name, position: 'Eng', url: 'https://a.co', startDate, endDate };
}

function textsOf(selector: string) {
  return Array.from(
    document.querySelectorAll(selector),
    (node) => node.textContent,
  );
}

describe('Experience', () => {
  it('measures every ongoing role against a single shared instant', () => {
    render(
      <Experience
        data={[job('First', '2020-01-01'), job('Second', '2018-01-01')]}
        now={new Date('2026-07-28T12:00:00Z').getTime()}
      />,
    );

    expect(textsOf('.daterange-duration [aria-hidden="true"]')).toEqual([
      '6 yr 6 mo+',
      '8 yr 6 mo+',
    ]);
  });
});

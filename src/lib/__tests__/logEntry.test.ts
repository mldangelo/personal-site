import { describe, expect, it } from 'vitest';

import { extractLogMarker } from '../logEntry';

describe('extractLogMarker', () => {
  it('lifts a leading age out of the sentence', () => {
    const result = extractLogMarker(
      'At 7, I discovered the mini-games hidden in Microsoft Office.',
    );

    expect(result).toEqual({
      marker: 'Age 7',
      rest: 'I discovered the mini-games hidden in Microsoft Office.',
    });
  });

  it('lifts an age range, with or without the leading "At"', () => {
    expect(
      extractLogMarker('At 14 - 17, I played a lot of video games.'),
    ).toEqual({ marker: 'Age 14–17', rest: 'I played a lot of video games.' });

    expect(extractLogMarker('14 - 17, I played a lot of video games.')).toEqual(
      { marker: 'Age 14–17', rest: 'I played a lot of video games.' },
    );
  });

  it('accepts en and em dashes in a range', () => {
    expect(extractLogMarker('At 14–17, I played games.')?.marker).toBe(
      'Age 14–17',
    );
    expect(extractLogMarker('At 14—17, I played games.')?.marker).toBe(
      'Age 14–17',
    );
  });

  it('lifts a leading year', () => {
    expect(extractLogMarker('In 2016, I visited Canada and Ethiopia.')).toEqual(
      { marker: '2016', rest: 'I visited Canada and Ethiopia.' },
    );
  });

  it('recapitalises the remainder, which now opens the sentence', () => {
    expect(extractLogMarker('At 20, co-authored a grant.')?.rest).toBe(
      'Co-authored a grant.',
    );
  });

  it('leaves entries that carry no leading marker alone', () => {
    for (const text of [
      'We subscribed to AOL in 1995.',
      'I was 11 when I built my first Tesla Coil.',
      'When I was 12, I set the all-time high record.',
      'My parents put a computer in my bedroom in 1993 when I was 3.',
      'I am an Oregon Trail II enthusiast.',
    ]) {
      expect(extractLogMarker(text)).toBeNull();
    }
  });

  it('does not treat a year inside the sentence as a marker', () => {
    expect(
      extractLogMarker('I visited Canada in 2016, then Japan.'),
    ).toBeNull();
  });

  it('rejects a marker with nothing left after it', () => {
    expect(extractLogMarker('At 20, ')).toBeNull();
    expect(extractLogMarker('In 2016, ')).toBeNull();
  });

  it('is case-insensitive on the leading word', () => {
    expect(extractLogMarker('at 13, I went to space camp.')?.marker).toBe(
      'Age 13',
    );
    expect(extractLogMarker('in 2019, I visited Canada.')?.marker).toBe('2019');
  });
});

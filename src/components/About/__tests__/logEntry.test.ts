import { describe, expect, it } from 'vitest';

import { extractLogMarker } from '../logEntry';

describe('extractLogMarker', () => {
  it('lifts a leading age out of the sentence', () => {
    expect(
      extractLogMarker(
        'At 7, I discovered the mini-games hidden in Microsoft Office.',
      ),
    ).toEqual({
      marker: 'Age 7',
      rest: 'I discovered the mini-games hidden in Microsoft Office.',
    });
  });

  it('lifts age ranges and years while leaving ordinary prose intact', () => {
    expect(extractLogMarker('At 14 - 17, I played games.')).toEqual({
      marker: 'Age 14–17',
      rest: 'I played games.',
    });
    expect(extractLogMarker('In 2016, I visited Canada.')).toEqual({
      marker: '2016',
      rest: 'I visited Canada.',
    });
    expect(extractLogMarker('I visited Canada in 2016.')).toBeNull();
  });
});
